import { SCHEMA_DELEGATE } from "@xballot/sdk";

const Delegate = SCHEMA_DELEGATE;

/**
 * @swagger
 * tags:
 *   name: Delegates
 *   description: Delegate management
 */

/**
 * @swagger
 * /v1/delegates/{address}:
 *   get:
 *     summary: Get delegate by address
 *     description: Get a delegate by its address.
 *     tags: [Delegates]
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric address of the delegate to get
 *     responses:
 *       200:
 *         description: Returns a single delegate
 *       404:
 *         description: Delegate not found
 *       500:
 *         description: An error occurred
 */

export const getDelegatesById = async (req, res) => {
  try {
    const delegateId = req.params.address;
    const delegate = await Delegate.findOne({ address: delegateId });
    if (!delegate) {
      return res.status(404).json({ error: "Delegate not found" });
    }
    // Cleaning up the profile object
    const { _id, __v, createdAt, updatedAt, ...cleanedDelegate } = delegate._doc;
    res.json(cleanedDelegate);
  } catch (error) {
    console.error(`Error in retrieving delegate: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};

/**
 * @swagger
 * /v1/delegates:
 *   get:
 *     summary: Get all delegates
 *     description: Retrieve a list of all delegates.
 *     tags: [Delegates]
 *     responses:
 *       200:
 *         description: Returns a list of delegates
 *       500:
 *         description: An error occurred
 */

export const getDelegates = async (req, res) => {
  try {
    const delegates = await Delegate.find({});

    const transformedDelegates = delegates.reduce((obj, delegate) => {
      const { address, domains } = delegate;
      obj[address] = domains;
      return obj;
    }, {});

    res.json(transformedDelegates);
  } catch (error) {
    console.error(`Error in retrieving delegates: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};


