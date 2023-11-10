import fetch from 'node-fetch';
import { getSettingsObject, getRoundCached } from '../utils/utils.mjs';
import { SCHEMA_PRIME, SCHEMA_DELEGATE, REGISTRAR_URL } from '@xballot/sdk';
import { NODE_ENV } from '../config.mjs';


const settingsCache = {};
const Prime = SCHEMA_PRIME;
const Delegate = SCHEMA_DELEGATE;

async function updatePrimes(primes, delegates) {
  const profileData = await fetch(REGISTRAR_URL + 'index/userIndex');
  let currentRound = await getRoundCached();
  const profileDataJSON = await profileData.json();
  const profileIds = Object.keys(profileDataJSON);

  await Promise.all(
    profileIds.map(async (profileId) => {
      const domainSettings = {};
      const primeDomain = profileDataJSON[profileId][0];
      try {
        let settingsObject;
        try {
          settingsObject = await getSettingsObject(primeDomain);
          // If fetch is successful, store the result in the cache
          if (settingsObject) {
            settingsCache[primeDomain] = settingsObject;
          }
        } catch (err) {
          //console.log(`Fetch failed for domain ${primeDomain}: ${err}`);
        }

        // Use the cached settingsObject if fetch failed or returned empty
        if (!settingsObject) {
          settingsObject = settingsCache[primeDomain];
        }

        domainSettings[primeDomain] = {
          address: profileId,
          appId: primeDomain,
          settings: settingsObject,
        };

        if (NODE_ENV !== 'development') {
          try {
            await Prime.findOneAndUpdate(
              { address: profileId },
              {
                $set: {
                  domains: domainSettings,
                },
              },
              { upsert: true }
            );
          } catch (error) {
            console.error(
              `Error updating prime with address ${profileId}: ${error}`
            );
          }
        }
        if (settingsObject?.delegations) {
          delegates[profileId] = {
            [primeDomain]: {
              address: profileId,
              appId: primeDomain,
              delegations: settingsObject.delegations || [],
              roundStamp: currentRound,
            },
          };

          if (NODE_ENV !== 'development') {
            try {
              await Delegate.findOneAndUpdate(
                { address: profileId },
                {
                  $set: {
                    [`domains.${primeDomain}`]: {
                      address: profileId,
                      appId: primeDomain,
                      delegations: settingsObject.delegations || [],
                      roundStamp: currentRound,
                    },
                  },
                },
                { upsert: true }
              );
            } catch (error) {
              console.error(
                `Error updating delegate with address ${profileId}: ${error}`
              );
            }
          }
        }
      } catch (error) {
        console.error(`Error updating prime for domain: ${primeDomain}`);
        console.error(error);
      }

      primes[profileId] = domainSettings;
    })
  );

  return primes;
}

export { updatePrimes };
