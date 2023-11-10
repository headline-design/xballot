import { SCHEMA_PRIME } from "@xballot/sdk";

const Prime = SCHEMA_PRIME;

/**
 * @swagger
 * tags:
 *   name: Primes
 *   description: Prime management
 */

/**
 * @swagger
 * /v1/primes/{address}:
 *   get:
 *     summary: Get prime by address
 *     description: Get a prime by its address.
 *     tags: [Primes]
 *     parameters:
 *       - in: path
 *         name: address
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric address of the prime to get
 *     responses:
 *       200:
 *         description: Returns a single prime
 *       404:
 *         description: Prime not found
 *       500:
 *         description: An error occurred
 */

export const getPrimeById = async (req, res) => {
  try {
    const primeId = req.params.address;
    const prime = await Prime.findOne({ address: primeId });
    if (!prime) {
      return res.status(404).json({ error: "Prime not found" });
    }
    // Cleaning up the profile object
    const { _id, __v, createdAt, updatedAt, ...cleanedPrime } = prime._doc;
    res.json(cleanedPrime);
  } catch (error) {
    console.error(`Error in retrieving prime: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};

/**
 * @swagger
 * /v1/primes:
 *   get:
 *     summary: Get all primes
 *     description: Retrieve a list of all primes.
 *     tags: [Primes]
 *     responses:
 *       200:
 *         description: Returns a list of primes
 *       500:
 *         description: An error occurred
 */

export const getPrimes = async (req, res) => {
  try {
    const primes = await Prime.find({});

    const transformedPrimes = primes.reduce((obj, prime) => {
      const { address, domains } = prime;
      obj[address] = domains;
      return obj;
    }, {});

    res.json(transformedPrimes);
  } catch (error) {
    console.error(`Error in retrieving primes: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};


