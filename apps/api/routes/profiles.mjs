import { SCHEMA_PROFILE } from "@xballot/sdk";

const Profile = SCHEMA_PROFILE;

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Profile management
 */

/**
 * @swagger
 * /v1/profiles/{profileId}:
 *   get:
 *     summary: Get profile by profileId
 *     description: Get a profile by its profileId.
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: profileId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the profile to get
 *     responses:
 *       200:
 *         description: Returns a single profile
 *       404:
 *         description: Profile not found
 *       500:
 *         description: An error occurred
 */
export const getProfileById = async (req, res) => {
  try {
    const profileId = req.params.address;
    const profile = await Profile.findOne({ address: profileId });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    // Cleaning up the profile object
    const { _id, __v, createdAt, updatedAt, ...cleanedProfile } = profile._doc;
    res.json(cleanedProfile);
  } catch (error) {
    console.error(`Error in retrieving profile: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};

/**
 * @swagger
 * /v1/profiles:
 *   get:
 *     summary: Get all profiles
 *     description: Retrieve a list of all profiles.
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: Returns a list of profiles
 *       500:
 *         description: An error occurred
 */
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({});

    const transformedProfiles = profiles.reduce((obj, profile) => {
      const { address, domains } = profile;
      obj[address] = domains;
      return obj;
    }, {});

    res.json(transformedProfiles);
  } catch (error) {
    console.error(`Error in retrieving profiles: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};



