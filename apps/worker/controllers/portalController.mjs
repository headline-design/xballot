import {
  getSettingsObject,
  getUserProposals,
  getRoundCached,
  mergeAndModifyTxns,
  processThreads,
} from "../utils/utils.mjs";
import { SCHEMA_PORTAL, SCHEMA_REPORT } from "@xballot/sdk";
import { NODE_ENV } from "../config.mjs";

const Portal = SCHEMA_PORTAL;
const Report = SCHEMA_REPORT;

async function updatePosts(
  daoDataJSON,
  minRound,
  domains,
  portals,
  reports,
  logger
) {
  try {
    for (const [key] of Object.entries(daoDataJSON)) {
      try {
        const appId = parseInt(key);
        const chainData = await getSettingsObject(appId);
        let currentRound = await getRoundCached();
        let posts = await getUserProposals(
          appId,
          chainData?.forum?.token,
          chainData?.forum?.tokenAmount,
          minRound,
          reports
        );

        let proposalIndex = {};

        if (domains[appId]?.proposals) {
          domains[appId].proposals.forEach((entry, index) => {
            proposalIndex[entry.txid] = index;
          });
        }

        Object.keys(posts.proposals).forEach((key) => {
          let propId = posts.proposals[key].proposalId;
          if (Object.keys(proposalIndex).includes(propId)) {
            domains[appId].proposals[proposalIndex[propId]].validation =
              posts.proposals[key];
          }
        });

        let proposals = { ...posts.proposals };
        delete posts.proposals;

        if (portals[appId] !== undefined) {

          let txnsArray = mergeAndModifyTxns(portals, appId, posts);
          txnsArray = processThreads(txnsArray);

          Object.assign(portals[appId].posts, txnsArray);
          Object.assign(portals[appId], chainData);
          Object.assign(portals[appId].proposals, proposals);
        } else {
         //console.log("writing initial domain");
          portals[appId] = {
            ...chainData,
            proposals,
            posts,
            roundStamp: currentRound,
          };
        }

        if (NODE_ENV !== "development") {
          if (
            Object.keys(posts).length > 0 ||
            Object.keys(proposals).length > 0
          ) {
            try {
              const result = await Portal.findOneAndUpdate(
                { appId: parseInt(appId) },
                {
                  $set: {
                    ...portals[appId],
                  },
                },
                { upsert: true, new: true }
              );

              if (!result) {
                console.log(
                  `findOneAndUpdate failed to update a portal with appId: ${appId}`
                );
              }
            } catch (dbError) {
              console.error(
                `Error in updating the portal in the database: ${dbError}`
              );
            }
          }

          if (Object.keys(reports).length > 0 && reports[appId]) {
            try {
              for (const [reportId, reportData] of Object.entries(
                reports[appId]
              )) {
                const reportResult = await Report.findOneAndUpdate(
                  { appId: parseInt(appId) },
                  {
                    $set: {
                      [`reports.${reportId}`]: reportData,
                    },
                  },
                  { upsert: true, new: true }
                );
                if (!reportResult) {
                  console.log(
                    `findOneAndUpdate failed to update a report with appId: ${appId}`
                  );
                }
              }
            } catch (dbError) {
              console.log(
                `Error in updating the report in the database: ${dbError}`
              );
            }
          }
        }
      } catch (error) {
        logger.error(`Error in updating posts: ${error}`);
        logger.info(key);
      }
    }
  } catch (e) {
    logger.error(`Error in updating posts: ${e}`);
  }
}

export { updatePosts };
