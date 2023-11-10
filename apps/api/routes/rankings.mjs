import { SCHEMA_RANKING } from '@xballot/sdk';
const Ranking = SCHEMA_RANKING;

/**
 * @swagger
 * tags:
 *   name: Rankings
 *   description: API endpoints for managing rankings
 */

/**
 * @swagger
 * /v1/rankings/{appId}:
 *   get:
 *     summary: Get ranking by AppId
 *     description: Get a ranking by its AppId.
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the app to get
 *     responses:
 *       200:
 *         description: Returns a single ranking
 *       404:
 *         description: Ranking not found
 *       500:
 *         description: An error occurred
 */
export const getRankingByAppId = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const ranking = await Ranking.findOne({ appId });
    if (!ranking) {
      return res.status(404).json({ error: 'Ranking not found' });
    }
    // Cleaning up the ranking object
    const { _id, __v, createdAt, updatedAt, ...cleanedRanking } = ranking._doc;
    res.json(cleanedRanking);
  } catch (error) {
    console.error(`Error in retrieving ranking: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
};

/**
 * @swagger
 * /v1/rankings:
 *   get:
 *     summary: Get all rankings
 *     description: Retrieve a list of all rankings.
 *     tags: [Rankings]
 *     responses:
 *       200:
 *         description: Returns a list of rankings
 *       500:
 *         description: An error occurred
 */

export const getRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find({});
    const transformedRankings = rankings.reduce((obj, ranking) => {
      const { _id, __v, createdAt, updatedAt, ...cleanedRanking } =
        ranking._doc;
      obj[ranking.appId] = cleanedRanking;
      return obj;
    }, {});
    res.json(transformedRankings);
  } catch (error) {
    console.error(`Error in retrieving rankings: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
};

/**
 * @swagger
 * /v1/rankings/spaces:
 *   get:
 *     summary: Get all space rankings
 *     description: Retrieve a list of all space rankings.
 *     tags: [Rankings]
 *     responses:
 *       200:
 *         description: Returns a list of space rankings
 *       500:
 *         description: An error occurred
 */
export const getSpaceRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find({ type: 'space' });
    const transformedRankings = rankings.reduce((obj, ranking) => {
      const { _id, __v, createdAt, updatedAt, ...cleanedRanking } =
        ranking._doc;
      obj[ranking.appId] = cleanedRanking;
      return obj;
    }, {});
    res.json(transformedRankings);
  } catch (error) {
    console.error(`Error in retrieving space rankings: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
};

/**
 * @swagger
 * /v1/rankings/users:
 *   get:
 *     summary: Get all user rankings
 *     description: Retrieve a list of all user rankings.
 *     tags: [Rankings]
 *     responses:
 *       200:
 *         description: Returns a list of user rankings
 *       500:
 *         description: An error occurred
 */
export const getUserRankings = async (req, res) => {
  try {
    const rankings = await Ranking.find({ type: 'user' });
    const transformedRankings = rankings.reduce((obj, ranking) => {
      const { _id, __v, createdAt, updatedAt, ...cleanedRanking } =
        ranking._doc;
      obj[ranking.appId] = cleanedRanking;
      return obj;
    }, {});
    res.json(transformedRankings);
  } catch (error) {
    console.error(`Error in retrieving user rankings: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
};
