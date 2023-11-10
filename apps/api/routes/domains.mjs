import { SCHEMA_SPACE } from '@xballot/sdk';

const Space = SCHEMA_SPACE;

/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: API endpoints for managing domains
 */

/**
 * @swagger
 * /v1/domains:
 *   get:
 *     summary: Retrieve a list of domains
 *     description: Retrieve a list of domains based on query parameters.
 *     tags: [Domains]
 *     parameters:
 *       - in: query
 *         name: spaces
 *         schema:
 *           type: boolean
 *         description: Filter domains with proposals
 *       - in: query
 *         name: users
 *         schema:
 *           type: boolean
 *         description: Filter domains without proposals
 *     responses:
 *       200:
 *         description: Returns a list of domains
 *       500:
 *         description: An error occurred
 */
async function getDomains(req, res) {
  try {
    const { spaces, users } = req.query;
    let filteredDomains = {};

    if (spaces === 'true') {
      // Check if spaces is set to 'true'
      filteredDomains = await Space.find({
        $and: [
          { 'proposals.0': { $exists: true } },
          { appId: { $ne: null } },
          { $expr: { $gt: [{ $size: '$members' }, 0] } },
        ],
      }).sort({ appId: 1 });
    } else if (users === 'true') {
      // Check if users is set to 'true'
      filteredDomains = await Space.find({
        'proposals.0': { $exists: false },
      }).sort({ appId: 1 });
    } else {
      filteredDomains = await Space.find({}).sort({ appId: 1 });
    }

    // Transform the array of filtered domains into an object.
    const transformedDomains = filteredDomains.reduce((obj, domain) => {
      obj[domain.appId] = domain;
      return obj;
    }, {});

    res.json(transformedDomains);
  } catch (error) {
    console.error(`Error in retrieving domains: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
}

/**
 * @swagger
 * /v1/domains/{appId}:
 *   get:
 *     summary: Get domain by AppId
 *     description: Get a domain by its AppId.
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the app to get
 *     responses:
 *       200:
 *         description: Returns a single domain
 *       404:
 *         description: Domain not found
 *       500:
 *         description: An error occurred
 */
async function getDomainByAppId(req, res) {
  try {
    const appId = parseInt(req.params.appId);
    const domain = await Space.findOne({ appId });
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    res.json(domain);
  } catch (error) {
    console.error(`Error in retrieving domain: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
}

/**
 * @swagger
 * /v1/domains/{appId}/proposals/{proposalId}:
 *   get:
 *     summary: Get proposal by proposalId for a specific domain
 *     description: Get a proposal by its proposalId for a specific domain specified by appId.
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the app
 *       - in: path
 *         name: proposalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the proposal to get
 *     responses:
 *       200:
 *         description: Returns a single proposal
 *       404:
 *         description: Proposal not found
 *       500:
 *         description: An error occurred
 */
async function getProposalById(req, res) {
  try {
    const appId = parseInt(req.params.appId);
    const proposalId = req.params.proposalId;
    const domain = await Space.findOne({ appId });
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    const proposal = domain.proposals.find((p) => p.txid === proposalId);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    console.error(`Error in retrieving proposal: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
}

/**
 * @swagger
 * /v1/domains/{appId}/proposals/{proposalId}/snapshot:
 *   get:
 *     summary: Get snapshot of a proposal for a specific domain
 *     description: Get the snapshot of a proposal specified by proposalId for a specific domain specified by appId.
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: appId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the app
 *       - in: path
 *         name: proposalId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the proposal to get snapshot for
 *     responses:
 *       200:
 *         description: Returns a single snapshot
 *       404:
 *         description: Snapshot not found
 *       500:
 *         description: An error occurred
 */
async function getSnapshot(req, res) {
  try {
    const appId = parseInt(req.params.appId);
    const proposalId = req.params.proposalId;
    const domain = await Space.findOne({ appId });

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const proposal = domain.proposals.find((p) => p.txid === proposalId);

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (!proposal.scores) {
      return res.status(404).json({ error: 'Snapshot not found' });
    }

    res.json({ snapshot: proposal.scores });
  } catch (error) {
    console.error(`Error in retrieving snapshot: ${error}`);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export { getDomains, getDomainByAppId, getProposalById, getSnapshot };
