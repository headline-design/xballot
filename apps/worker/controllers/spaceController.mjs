import { SCHEMA_SPACE, CONST_PROPOSALS } from '@xballot/sdk';

import {
  getSettingsObject,
  getAllOpted,
  getHistoricalVotes,
  getVotes,
  getRoundCached,
} from '../utils/utils.mjs';
import { NODE_ENV } from '../config.mjs';

const Space = SCHEMA_SPACE;

async function updateSpaces(daoDataJSON, minRound, proposals, domains, logger) {
  if (minRound === undefined) {
    minRound = 0;
  }
  const currentRound = await getRoundCached();

  for (const [key, value] of Object.entries(daoDataJSON)) {
    try {
      const appId = parseInt(key);
      const chainData = await getSettingsObject(appId);
      const members = await getAllOpted(appId, 0, 0);
      const hist = await getHistoricalVotes(key, minRound);

      const pArray = hist.map((proposal) => ({
        ...CONST_PROPOSALS[0],
        ...proposal.pDescription,
        ...proposal,
        space: proposal.settings,
        appId,
      }));

      let ranThisTime = [];

      const updatedProposals = await Promise.all(
        pArray.map(async (proposal) => {
          ranThisTime.push(proposal.txid);

          try {
            const data = await getVotes(
              proposal?.txid,
              appId,
              proposal?.token,
              proposal?.maxRound,
              proposal?.minRound,
              proposal?.strategyType,
              proposal?.choices
            );

            //console.log(minRound);
            //console.log(proposal.maxRound);

            let currentRound = await getRoundCached();

            if (proposal.maxRound >= currentRound) {
              proposal.finalized = false;
            } else {
              proposal.finalized = true;
            }
            //const tData = await getTokenData(proposal?.token);
            return { ...proposal, scores: data, roundStamp: currentRound };
          } catch (error) {
            //console.log('error', error)
            return proposal;
          }
        })
      );

      let domainTemplate = {
        ...chainData,
        ...value,
        members,
        appId: parseInt(appId),
        roundStamp: currentRound,
      };

      if (domains[appId]) {
        Object.assign(domains[appId], domainTemplate);
      } else {
        domains[appId] = { ...domainTemplate };
      }

      if (domains[appId]?.proposals) {
        let oldPropKeys = [];

        domains[appId].proposals.forEach((p) => {
          oldPropKeys.push(p.txid);
        });

        updatedProposals.forEach((newP) => {
          if (!oldPropKeys.includes(newP.txid)) {
            domains[appId].proposals.unshift(newP);
          }
        });
      } else {
        domains[appId].proposals = updatedProposals;
      }

      for (let i = 0; i < domains[appId].proposals.length; i++) {
        let proposal = domains[appId].proposals[i];
        if (!proposal.finalized && !ranThisTime.includes(proposal.txid)) {
          console.log('running new vote check...');
          try {
            let voteInfo = await getVotes(
              proposal?.txid,
              appId,
              proposal?.token,
              proposal?.maxRound,
              proposal?.minRound,
              proposal?.strategyType,
              proposal?.choices
            );

            //console.log("voteInfo: ");
            //console.log(voteInfo);

            if (voteInfo !== undefined) {
              proposal.scores = voteInfo;
            }
          } catch (e) {
            console.log('error in vote check');
          }
        }
      }
      if (NODE_ENV !== 'development') {
        try {
          await Space.findOneAndUpdate(
            { appId: appId },
            {
              $set: {
                ...domains[appId],
              },
            },
            { upsert: true, timeout: 30000 }
          );
        } catch (error) {
          console.error(`Error updating space with appId ${appId}: ${error}`);
        }
      }
    } catch (error) {
      console.error(`Error in updating space: ${error}`);
    }
  }
  return proposals;
}

export { updateSpaces };
