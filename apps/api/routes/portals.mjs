import { SCHEMA_PORTAL } from '@xballot/sdk';
const Portal = SCHEMA_PORTAL;

/**
 * @swagger
 * tags:
 *   name: Portals
 *   description: API endpoints for managing portals
 */

/**
 * @swagger
 * /v1/portals/{appId}:
 *   get:
 *     summary: Get portal by AppId
 *     description: Get a portal by its AppId.
 *     tags: [Portals]
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the app to get
 *     responses:
 *       200:
 *         description: Returns a single portal
 *       404:
 *         description: Portal not found
 *       500:
 *         description: An error occurred
 */
export const getPortalByAppId = async (req, res) => {
  try {
    const appId = parseInt(req.params.appId);
    const portal = await Portal.findOne({ appId });
    if (!portal) {
      return res.status(404).json({ error: 'Portal not found' });
    }
    // Cleaning up the portal object
    const { _id, __v, createdAt, updatedAt, ...cleanedPortal } = portal._doc;
    res.json(cleanedPortal);
  } catch (error) {
    console.error(`Error in retrieving portal: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
};

/**
 * @swagger
 * /v1/portals:
 *   get:
 *     summary: Get all portals
 *     description: Retrieve a list of all portals.
 *     tags: [Portals]
 *     responses:
 *       200:
 *         description: Returns a list of portals
 *       500:
 *         description: An error occurred
 */

export const getPortals = async (req, res) => {
  try {
    const portals = await Portal.find({});
    const transformedPortals = portals.reduce((obj, portal) => {
      const { _id, __v, createdAt, updatedAt, ...cleanedPortal } = portal._doc;
      obj[portal.appId] = cleanedPortal;
      return obj;
    }, {});
    res.json(transformedPortals);
  } catch (error) {
    console.error(`Error in retrieving profiles: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
};
