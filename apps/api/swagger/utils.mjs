import swaggerJsdoc from "swagger-jsdoc";
import { SERVER_URL } from "@xballot/sdk"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "XBallot API",
      version: "1.0.1",
      description: "XBallot API Documentation",
      contact: {
        name: "XBallot Team",
        url: "https://xballot.net",
        email: "aaron@headline.dev",
      },
    },
    tags: [
      { name: "Profiles", description: "API endpoints for managing profiles" },
      { name: "Primes", description: "API endpoints for managing primes" },
      { name: "Delegates", description: "API endpoints for managing delegates" },
      { name: "Reports", description: "API endpoints for managing reports" },
    ],
    components: {
      schemas: {
        Space: {
          type: "object",
          properties: {
            id: { type: "string", example: "space-123" },
            name: { type: "string", example: "Space Name" },
            symbol: { type: "string", example: "SPC" },
            network: { type: "number", example: 1 },
            strategy: { type: "string", example: "voting" },
            about: { type: "string", example: "Space description" },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.jpg",
            },
            domain: { type: "string", example: "example.com" },
            website: { type: "string", example: "https://example.com" },
            terms: { type: "string", example: "Terms and conditions" },
            coingecko: { type: "string", example: "https://coingecko.com/SPC" },
            github: { type: "string", example: "https://github.com/spc" },
            twitter: { type: "string", example: "@spc" },
            followersCount: { type: "number", example: 100 },
            private: { type: "boolean", example: false },
            admins: {
              type: "array",
              items: { type: "string", example: "admin-1" },
            },
            members: { type: "array", items: { type: "object" } },
            categories: {
              type: "object",
              properties: {
                id: { type: "number", example: 1 },
                name: { type: "string", example: "Category 1" },
              },
            },
            filters: {
              type: "object",
              properties: {
                minScore: { type: "number", example: 10 },
                onlyMembers: { type: "boolean", example: true },
              },
            },
            treasuries: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number", example: 1 },
                  address: { type: "string", example: "0x1234567890" },
                  name: { type: "string", example: "Treasury 1" },
                  network: { type: "number", example: 1 },
                },
              },
            },
            voting: {
              type: "object",
              properties: {
                delay: { type: "number", default: 0, example: 60 },
                hideAbstain: { type: "boolean", default: false, example: true },
                period: { type: "number", default: 0, example: 604800 },
                quorum: { type: "number", default: 0, example: 50 },
                type: { type: "string", default: "", example: "plurality" },
                privacy: { type: "string", default: "", example: "public" },
                token: { type: "string", example: "SPC" },
                creator: { type: "string", example: "admin-1" },
                controller: { type: "string", example: "0x1234567890" },
              },
            },
            appId: { type: "string", example: "app-123" },
            assetId: { type: "number", example: 1 },
            description: { type: "string", example: "Space description" },
            userName: { type: "string", example: "John Doe" },
            strategies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  text: { type: "string", example: "Strategy text" },
                  title: { type: "string", example: "Strategy title" },
                  description: {
                    type: "string",
                    example: "Strategy description",
                  },
                },
              },
            },
            plugins: { type: "object" },
            forum: {
              type: "object",
              properties: {
                token: { type: "string", example: "SPC" },
                tokenAmount: { type: "string", example: "100" },
                about: { type: "string", example: "Forum about" },
              },
            },
            proposal: {
              type: "object",
              properties: {
                token: { type: "object" },
                template: { type: "string", example: "Proposal template" },
              },
            },
            parent: {
              type: "object",
              properties: {
                id: { type: "string", example: "parent-123" },
                name: { type: "string", example: "Parent Space" },
              },
            },
            children: {
              type: "array",
              items: { type: "string", example: "child-1" },
            },
            skin: { type: "string", example: "skin-1" },
            guidelines: { type: "string", example: "Guidelines content" },
            template: { type: "string", example: "Template content" },
            enabled: { type: "boolean", example: true },
            asset: { type: "number", example: 1 },
            categories: { type: "object" },
            postId: { type: "string", example: "post-123" },
            snapshot: { type: "string", example: "snapshot-123" },
            state: { type: "string", example: "active" },
            privacy: { type: "string", example: "public" },
            discussion: { type: "string", example: "Discussion content" },
            quorum: { type: "number", example: 50 },
            settings: { type: "object" },
            time: { type: "number", example: 1621872000 },
            txid: { type: "string", example: "0x1234567890" },
            maxRound: { type: "number", example: 5 },
            minRound: { type: "number", example: 1 },
            validation: { type: "object" },
            metadata: { type: "object" },
            proposals: {
              type: "object",
              properties: {
                title: { type: "string", example: "Proposal title" },
                appId: { type: "string", example: "app-123" },
                description: {
                  type: "string",
                  example: "Proposal description",
                },
                content: { type: "string", example: "Proposal content" },
                prime: { type: "string", example: "prime-123" },
                creator: { type: "string", example: "admin-1" },
                ipfsHash: { type: "string", example: "ipfs-123" },
                network: { type: "string", example: "1" },
                choices: {
                  type: "array",
                  items: { type: "string", example: "choice-1" },
                },
                type: { type: "string", example: "proposal" },
                snapshot: { type: "string", example: "snapshot-123" },
                start: { type: "number", example: 1621872000 },
                end: { type: "number", example: 1622476800 },
                state: { type: "string", example: "active" },
                symbol: { type: "string", example: "SPC" },
                privacy: { type: "string", example: "public" },
                discussion: { type: "string", example: "Discussion content" },
                quorum: { type: "number", example: 50 },
                scores: {
                  type: "object",
                  properties: {
                    total: { type: "number", example: 100 },
                    tallies: { type: "object" },
                    votes: { type: "object" },
                  },
                },
                scores_state: { type: "string", example: "active" },
                scores_total: { type: "number", example: 100 },
                scores_by_strategy: { type: "number", example: 80 },
                strategy: { type: "string", example: "voting" },
                token: { type: "object" },
                validation: { type: "object" },
                metadata: { type: "object" },
              },
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            title: { type: "string", example: "Post title" },
            description: { type: "string", example: "Post description" },
            content: { type: "string", example: "Post content" },
            postId: { type: "string", example: "post-123" },
            prime: { type: "string", example: "prime-123" },
            creator: { type: "string", example: "admin-1" },
            id: { type: "string", example: "post-123" },
            ipfsHash: { type: "string", example: "ipfs-123" },
            network: { type: "string", example: "1" },
            type: { type: "string", example: "post" },
            state: { type: "string", example: "active" },
            symbol: { type: "string", example: "SPC" },
            space: { $ref: "#/components/schemas/Space" },
          },
        },
        Profile: {
          type: "object",
          properties: {
            id: { type: "string", example: "profile-123" },
            about: { type: "string", example: "Profile description" },
            appId: { type: "string", example: "app-123" },
            asset: { type: "number", example: 1 },
            assetId: { type: "number", example: 1 },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.jpg",
            },
            creator: { type: "string", example: "admin-1" },
            domain: { type: "string", example: "example.com" },
            enabled: { type: "boolean", example: true },
            name: { type: "string", example: "John Doe" },
          },
        },
        Prime: {
          type: "object",
          properties: {
            id: { type: "string", example: "prime-123" },
            settings: {
              type: "object",
              properties: {
                name: { type: "string", example: "Prime Name" },
                about: { type: "string", example: "Prime description" },
                avatar: {
                  type: "string",
                  example: "https://example.com/avatar.jpg",
                },
                appId: { type: "string", example: "app-123" },
                assetId: { type: "string", example: "asset-123" },
                domain: { type: "string", example: "example.com" },
                delegations: {
                  type: "array",
                  items: { type: "string", example: "delegation-1" },
                },
                creator: { type: "string", example: "admin-1" },
                controller: { type: "string", example: "0x1234567890" },
              },
            },
          },
        },
        FiltersSchema: {
          type: "object",
          properties: {
            minScore: { type: "number", example: 10 },
            onlyMembers: { type: "boolean", example: true },
          },
        },
        ForumSchema: {
          type: "object",
          properties: {
            token: { type: "string", example: "SPC" },
            tokenAmount: { type: "string", example: "100" },
            about: { type: "string", example: "Forum about" },
          },
        },
        ChoiceSchema: {
          type: "object",
          properties: {
            key: { type: "number", example: 1 },
            id: { type: "string", example: "choice-1" },
            choice: { type: "string", example: "Choice 1" },
          },
        },
        StrategyTypeSchema: {
          type: "object",
          properties: {
            text: { type: "string", example: "Strategy text" },
            title: { type: "string", example: "Strategy title" },
            description: { type: "string", example: "Strategy description" },
          },
        },
        TokenSchema: {
          type: "object",
          properties: {
            assetId: { type: "string", example: "asset-123" },
            decimals: { type: "number", example: 18 },
            unitName: { type: "string", example: "SPC" },
            name: { type: "string", example: "Space Coin" },
            total: { type: "number", example: 1000000 },
          },
        },
        ProposalVoteSchema: {
          type: "object",
          properties: {
            votes: { type: "number", example: 1 },
            option: { type: "string", example: "choice-1" },
            signature: { type: "string", example: "signature-123" },
            txid: { type: "string", example: "txid-123" },
          },
        },
        ProposalTallySchema: {
          type: "object",
          additionalProperties: { type: "number" },
        },
        ProposalsSchema: {
          type: "object",
          properties: {
            title: { type: "string", example: "Proposal title" },
            appId: { type: "string", example: "app-123" },
            description: { type: "string", example: "Proposal description" },
            content: { type: "string", example: "Proposal content" },
            prime: { type: "string", example: "prime-123" },
            creator: { type: "string", example: "admin-1" },
            ipfsHash: { type: "string", example: "ipfs-123" },
            network: { type: "string", example: "1" },
            choices: { type: "object" },
            type: { type: "string", example: "proposal" },
            snapshot: { type: "string", example: "snapshot-123" },
            start: { type: "number", example: 1621872000 },
            end: { type: "number", example: 1622476800 },
            state: { type: "string", example: "active" },
            symbol: { type: "string", example: "SPC" },
            privacy: { type: "string", example: "public" },
            discussion: { type: "string", example: "Discussion content" },
            quorum: { type: "number", example: 50 },
            scores: {
              type: "object",
              properties: {
                total: { type: "number", example: 100 },
                tallies: { type: "object" },
                votes: { type: "object" },
              },
            },
            scores_state: { type: "string", example: "active" },
            scores_total: { type: "number", example: 100 },
            scores_by_strategy: { type: "number", example: 80 },
            strategy: { type: "string", example: "voting" },
            token: { type: "object" },
            validation: { type: "object" },
            metadata: { type: "object" },
          },
        },
        TreasurySchema: {
          type: "object",
          properties: {
            id: { type: "number", example: 1 },
            address: { type: "string", example: "0x1234567890" },
            name: { type: "string", example: "Treasury 1" },
            network: { type: "number", example: 1 },
          },
        },
        StrategySchema: {
          type: "object",
          properties: {
            text: { type: "string", example: "Strategy text" },
            title: { type: "string", example: "Strategy title" },
            description: { type: "string", example: "Strategy description" },
          },
        },
        VotingSchema: {
          type: "object",
          properties: {
            delay: { type: "number", default: 0, example: 60 },
            hideAbstain: { type: "boolean", default: false, example: true },
            period: { type: "number", default: 0, example: 604800 },
            quorum: { type: "number", default: 0, example: 50 },
            type: { type: "string", default: "", example: "plurality" },
            privacy: { type: "string", default: "", example: "public" },
            token: { type: "string", example: "SPC" },
            creator: { type: "string", example: "admin-1" },
            controller: { type: "string", example: "0x1234567890" },
          },
        },
        ProposalDescriptionSchema: {
          type: "object",
          properties: {
            title: { type: "string", example: "Proposal title" },
            content: { type: "string", example: "Proposal content" },
            discussion: { type: "string", example: "Discussion content" },
            choices: {
              type: "array",
              items: { $ref: "#/components/schemas/ChoiceSchema" },
            },
            start: { type: "number", example: 1621872000 },
            end: { type: "number", example: 1622476800 },
            metadata: { type: "object" },
            strategyType: { $ref: "#/components/schemas/StrategyTypeSchema" },
            token: { type: "string", example: "SPC" },
          },
        },
      },
      requestBodies: {
        RequestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RequestModel",
              },
            },
          },
          required: true,
        },
      },
    },
    servers: [
      {
        url: SERVER_URL,
      },
    ],
  },
  apis: [
    "./routes/domains.mjs",
    "./routes/primes.mjs",
    "./routes/portals.mjs",
    "./routes/profiles.mjs",
    "./routes/reports.mjs",
    "./routes/delegates.mjs",

  ],
};

export const specs = swaggerJsdoc(options);
