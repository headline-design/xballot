import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger/utils.mjs";
import { MONGODB_URL } from "@xballot/sdk";

dotenv.config();

const app = express();
app.use(cors(), express.json());

// MongoDB connection
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Route handlers
const getDomains = async (req, res) => {
  const { getDomains } = await import("./routes/domains.mjs");
  getDomains(req, res);
};

const getDomainByAppId = async (req, res) => {
  try {
    const { getDomainByAppId } = await import("./routes/domains.mjs");
    await getDomainByAppId(req, res);
  } catch (error) {
    console.error(`Error in handling /v1/domains/:appId: ${error}`);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getProposalById = async (req, res) => {
  const { getProposalById } = await import("./routes/domains.mjs");
  getProposalById(req, res);
};

const getSnapshot = async (req, res) => {
  const { getSnapshot } = await import("./routes/domains.mjs");
  getSnapshot(req, res);
};

const getPrimeById = async (req, res) => {
  const { getPrimeById } = await import("./routes/primes.mjs");
  getPrimeById(req, res);
};

const getPortalByAppId = async (req, res) => {
  const { getPortalByAppId } = await import("./routes/portals.mjs");
  getPortalByAppId(req, res);
};

const getReportByAppId = async (req, res) => {
  const { getReportByAppId } = await import("./routes/reports.mjs");
  getReportByAppId(req, res);
};

const getDelegatesById = async (req, res) => {
  const { getDelegatesById } = await import("./routes/delegates.mjs");
  getDelegatesById(req, res);
};

const getProfileById = async (req, res) => {
  const { getProfileById } = await import("./routes/profiles.mjs");
  getProfileById(req, res);
};

const getPrimes = async (req, res) => {
  const { getPrimes } = await import("./routes/primes.mjs");
  getPrimes(req, res);
};

const getPortals = async (req, res) => {
  const { getPortals } = await import("./routes/portals.mjs");
  getPortals(req, res);
};

const getReports = async (req, res) => {
  const { getReports } = await import("./routes/reports.mjs");
  getReports(req, res);
};

const getProfiles = async (req, res) => {
  const { getProfiles } = await import("./routes/profiles.mjs");
  getProfiles(req, res);
};

const getDelegates = async (req, res) => {
  const { getDelegates } = await import("./routes/delegates.mjs");
  getDelegates(req, res);
};

const getRankings = async (req, res) => {
  const { getRankings } = await import("./routes/rankings.mjs");
  getRankings(req, res);
};

const getSpaceRankings = async (req, res) => {
  const { getSpaceRankings } = await import("./routes/rankings.mjs");
  getSpaceRankings(req, res);
};

const getUserRankings = async (req, res) => {
  const { getUserRankings } = await import("./routes/rankings.mjs");
  getUserRankings(req, res);
};

const getRankingByAppId = async (req, res) => {
  const { getRankingByAppId } = await import("./routes/rankings.mjs");
  getRankingByAppId(req, res);
};

// Routes
app.get("/v1/domains", getDomains);
app.get("/v1/domains/:appId", getDomainByAppId);
app.get("/v1/domains/:appId/proposals/:proposalId", getProposalById);
app.get("/v1/domains/:appId/proposals/:proposalId/snapshot", getSnapshot);
app.get("/v1/primes/:address", getPrimeById);
app.get("/v1/portals/:appId", getPortalByAppId);
app.get("/v1/reports/:appId", getReportByAppId);
app.get("/v1/delegates/:address", getDelegatesById);
app.get("/v1/profiles/:address", getProfileById);
app.get("/v1/primes", getPrimes);
app.get("/v1/portals", getPortals);
app.get("/v1/profiles", getProfiles);
app.get("/v1/reports", getReports);
app.get("/v1/delegates", getDelegates);
app.get("/v1/rankings/spaces", getSpaceRankings);
app.get("/v1/rankings/users", getUserRankings);
app.get("/v1/rankings/:appId", getRankingByAppId);
app.get("/v1/rankings", getRankings);

// Static assets
const uiOpts = {
  customSiteTitle: "XBallot API Docs",
  customfavIcon: "/assets/favicon.ico",
  customCss: "/assets/custom.css",
};

var options = {
  customJsStr: [
    'console.log("Hello World")',
    `
    var metaTag=document.createElement('meta');
    metaTag.name = "viewport"
    metaTag.content = "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    `,
  ],
  customSiteTitle: "XBallot API Docs",
  customfavIcon: uiOpts.customfavIcon,
  customCssUrl: uiOpts.customCss,
};

// Swagger docs generation
app.use(
  "/api-dev/v1",
  swaggerUi.serve,
  swaggerUi.setup(specs, options, {
    customSiteTitle: "XBallot API Docs",
    customfavIcon: uiOpts.customfavIcon,
    customCssUrl: uiOpts.customCss,
  })
);

app.use("/assets", express.static("assets"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
