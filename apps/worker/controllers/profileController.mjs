import fetch from "node-fetch";
import { getSettingsObject, getRoundCached } from "../utils/utils.mjs";
import {SCHEMA_PROFILE, REGISTRAR_URL } from "@xballot/sdk";
import { NODE_ENV } from "../config.mjs";

// Cache to store settings objects by domainId
const settingsCache = {};
const Profile = SCHEMA_PROFILE;

async function updateProfiles(profiles) {
  const profileData = await fetch(
    REGISTRAR_URL + "index/userIndex"
  );
  const profileDataJSON = await profileData.json();
  let currentRound = await getRoundCached();
  const profileIds = Object.keys(profileDataJSON);

  await Promise.all(profileIds.map(async profileId => {
    if (!profiles[profileId]) {
      profiles[profileId] = {};
    }
    const domainSettings = profiles[profileId];

    await Promise.all(profileDataJSON[profileId].map(async domainId => {
      try {
        let settingsObject;
        try {
          settingsObject = await getSettingsObject(domainId);
          // If fetch is successful, store the result in the cache
          if (settingsObject) {
            settingsCache[domainId] = settingsObject;
          }
        } catch (err) {
          console.error(`Fetch failed for domain ${domainId}: ${err}`);
        }

        // Use the cached settingsObject if fetch failed or returned empty
        if (!settingsObject) {
          settingsObject = settingsCache[domainId] || {};
        }

        domainSettings[domainId] = {
          address: profileId,
          appId: domainId,
          settings: settingsObject,
          roundStamp: currentRound,
        };

        // Update or create user in the database
        if (NODE_ENV !== "development") {
          try {
            await Profile.findOneAndUpdate(
              { address: profileId },
              {
                $set: {
                  [`domains.${domainId}`]: {
                    address: profileId,
                    appId: domainId,
                    settings: settingsObject,
                    roundStamp: currentRound,
                  },
                },
              },
              { upsert: true }
            );
          } catch (error) {
            console.error(`Error updating profile with address ${profileId}: ${error}`);
          }
        }
      } catch (error) {
        console.error(`Error in domain settings for ${domainId}: ${error}`);
      }
    }));

    profiles[profileId] = domainSettings;
  }));

  return { profiles };
}

export { updateProfiles };
