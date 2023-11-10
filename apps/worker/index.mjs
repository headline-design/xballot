import mongoose from 'mongoose';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import _ from 'lodash';
import registerMiddleware from './utils/middleware.mjs';
import express from 'express';
import { getRound } from './utils/utils.mjs';
import {
  SCHEMA_SPACE,
  SCHEMA_PRIME,
  SCHEMA_PORTAL,
  SCHEMA_PROFILE,
  SCHEMA_REPORT,
  SCHEMA_DELEGATE,
  SCHEMA_PROPOSAL,
  SCHEMA_RANKING,
  REGISTRAR_URL,
  MONGODB_URL,
} from '@xballot/sdk';
import { NODE_ENV } from './config.mjs';
import winston from 'winston';
import createRouter from './routes/router.mjs';
import { updateProfiles } from './controllers/profileController.mjs';
import { updatePrimes } from './controllers/primeController.mjs';
import { updateSpaces } from './controllers/spaceController.mjs';
import { updatePosts } from './controllers/portalController.mjs';
import {
  updateSpaceRankings,
  updateUserRankings,
} from './controllers/rankingController.mjs';
import NodeCache from 'node-cache';

const Space = SCHEMA_SPACE;
const Prime = SCHEMA_PRIME;
const Portal = SCHEMA_PORTAL;
const Profile = SCHEMA_PROFILE;
const Report = SCHEMA_REPORT;
const Delegate = SCHEMA_DELEGATE;
const Proposal = SCHEMA_PROPOSAL;
const Ranking = SCHEMA_RANKING;

const daoCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [new winston.transports.Console()],
});

dotenv.config();

if (NODE_ENV !== 'development') {
  mongoose
    .connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('MongoDB Connected...');

      // Create collections
      Space.createCollection();
      Proposal.createCollection();
      Portal.createCollection();
      Profile.createCollection();
      Delegate.createCollection();
      Prime.createCollection();
      Report.createCollection();
      Ranking.createCollection();
    })
    .catch((err) => logger.error(err));
} else {
  console.log('Running in development mode. MongoDB not connected...');
}

const app = express();

registerMiddleware(app);

let lastFetched = undefined;

let portals = {};
let domains = {};
let profiles = {};
let primes = {};
let reports = {};
let delegates = {};
let proposals = {};
let spaces = {};
let users = {};

async function fetchDaoData() {
  let daoDataJSON = daoCache.get('daoData');
  if (daoDataJSON == undefined) {
    const daoData = await fetch(REGISTRAR_URL + 'index/daos');
    daoDataJSON = await daoData.json();
    daoCache.set('daoData', daoDataJSON);
  }
  return daoDataJSON;
}

function reflect(promise) {
  return promise.then(
    (v) => ({ v, status: 'fulfilled' }),
    (error) => ({ error, status: 'rejected' })
  );
}

let lastRankingUpdate = null;

async function update() {
  try {
    let daoDataJSON = await fetchDaoData();

    let now = Date.now();

    let results = await Promise.all([
      reflect(
        updateSpaces(daoDataJSON, lastFetched, proposals, domains, logger)
      ),
      reflect(updateProfiles(profiles)),
      reflect(updatePrimes(primes, delegates)),
      reflect(
        updatePosts(daoDataJSON, lastFetched, domains, portals, reports, logger)
      ),
    ]);

    let successfulPromises = results.filter((x) => x.status === 'fulfilled');
    let failedPromises = results.filter((x) => x.status === 'rejected');

    console.log(`${successfulPromises.length} operations were successful.`);
    console.log(`${failedPromises.length} operations failed.`);

    lastFetched = await getRound();

    if (!lastRankingUpdate || now - lastRankingUpdate >= 6 * 60 * 60 * 1000) {
      console.log('Updating rankings...');
      let rankingResults = await Promise.all([
        reflect(updateSpaceRankings(daoDataJSON, spaces)),
        reflect(updateUserRankings(daoDataJSON, users)),
      ]);

      if (rankingResults.status === 'rejected') {
        console.error('---Failed to update rankings');
      } else {
        lastRankingUpdate = now;
      }
    }

    let future = Date.now();
    console.log('worker time to finish ' + (future - now) + ' ms');
  } catch (error) {
    console.error('An error occurred during the update:');
    console.error(error);
  }
}

// Run update every 5 seconds
setInterval(update, 5000);

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
});

const router = createRouter(
  portals,
  profiles,
  primes,
  proposals,
  domains,
  reports,
  delegates,
  spaces,
  users
);
app.use('', router);

console.log('Starting server...');

// Start listening on the specified port
const server = app.listen(7000, function () {
  console.log('Node server now listening on port 7000!');
});

server.on('error', (err) => {
  logger.error('Error occurred while starting server:', err);
});
