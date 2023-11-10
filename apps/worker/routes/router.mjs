import express from "express";

const createRouter = (
  portals,
  profiles,
  primes,
  proposals,
  domains,
  reports,
  delegates,
  rankingSpaces,
  rankingUsers
) => {
  const router = express.Router();

  router.get("/index/:name", function (req, res) {
    switch (req.params.name) {
      case "proposals":
        res.send(proposals);
        break;
      case "portals":
        res.send(portals);
        break;
      case "reports":
        res.send(reports);
        break;
      case "profiles":
        res.send(profiles);
        break;
      case "delegates":
        res.send(delegates);
        break;
      case "primes":
        res.send(primes);
        break;
      case "rankings":
      res.send({spaces: rankingSpaces, users: rankingUsers});
      break;
      case "domains":
        let { spaces, users } = req.query;
        let filteredDomains = {};
        if (spaces) {
          filteredDomains = Object.fromEntries(
            Object.entries(domains).filter(
              ([id, domain]) =>
                domain?.proposals?.length > 0 &&
                domain?.appId &&
                domain?.members?.length > 0
            )
          );
        } else if (users) {
          filteredDomains = Object.fromEntries(
            Object.entries(domains).filter(
              ([id, domain]) => domain?.proposals?.length === 0
            )
          );
        } else {
          filteredDomains = domains;
        }

        res.send(filteredDomains);
        break;
      default:
        res.send({ message: "not found" });
        break;
    }
  });

  router.get("/index/rankings/spaces", function (req, res) {
    res.send({spaces: rankingSpaces});
  });

  router.get("/index/rankings/users", function (req, res) {
    res.send({users: rankingUsers});
  });

  router.get("/index/domains/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    if (id in domains) {
      res.json({ domain: domains[id] });
    } else {
      res.json({ message: "domain not found" });
    }
  });

  router.get(
    "/index/domains/:id/proposal/:proposalId",
    async function (req, res) {
      const id = parseInt(req.params.id);
      const proposalId = req.params.proposalId;
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      if (id in domains) {
        const domain = domains[id];
        const proposal = domain?.proposals.find((p) => p.txid === proposalId);

        if (proposal) {
          res.json({ proposal });
        } else {
          res.json({ message: "proposal not found" });
        }
      } else {
        res.json({ message: "domain not found" });
      }
    }
  );

  router.get(
    "/index/domains/:id/proposal/:proposalId/snapshot",
    async function (req, res) {
      const id = parseInt(req.params.id);
      const proposalId = req.params.proposalId;
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid id" });
      }

      if (id in domains) {
        const domain = domains[id];
        const proposal = domain?.proposals.find((p) => p.txid === proposalId);

        if (proposal) {
          res.json({ snapshot: proposal.scores });
        } else {
          res.json({ message: "proposal not found" });
        }
      } else {
        res.json({ message: "domain not found" });
      }
    }
  );

  router.get("/index/portals/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    if (id in portals) {
      res.json({ portal: portals[id] });
    } else {
      res.json({ message: "portal not found" });
    }
  });

  router.get("/index/reports/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    if (id in reports) {
      res.json({ report: reports[id] });
    } else {
      res.json({ message: "portal not found" });
    }
  });

  router.get("/index/profiles/:id", async function (req, res) {
    const id = req.params.id;

    if (id in profiles) {
      res.json({ profile: profiles[id] });
    } else {
      res.json({ message: "profile not found" });
    }
  });

  router.get("/index/delegates/:id", async function (req, res) {
    const id = parseInt(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    if (id in delegates) {
      res.json({ delegate: delegates[id] });
    } else {
      res.json({ message: "delegate not found" });
    }
  });

  router.get("/index/primes/:id", async function (req, res) {
    const id = req.params.id;

    if (id in primes) {
      res.json({ prime: primes[id] });
    } else {
      res.json({ message: "prime not found" });
    }
  });

  router.get("/index/proposals/:proposalId", async function (req, res) {
    const proposalId = req.params.proposalId;

    if (proposalId in proposals) {
      res.json({ proposal: proposals[proposalId] });
    } else {
      res.json({ message: "proposal not found" });
    }
  });

  router.get("/index/rankings/spaces/:appId", async function (req, res) {
    const appId = req.params.appId;

    if (appId in rankingSpaces) {
      res.json({ ranking: rankingSpaces[appId] });
    } else {
      res.json({ message: "application not found" });
    }
  });

  router.get("/index/rankings/users/:appId", async function (req, res) {
    const appId = req.params.appId;

    if (appId in rankingUsers) {
      res.json({ ranking: rankingUsers[appId] });
    } else {
      res.json({ message: "application not found" });
    }
  });

  // default route
  router.get("*", function (req, res) {
    res.status(404).send({ message: "Route not found" });
  });

  return router;
};

export default createRouter;
