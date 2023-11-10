# XBallot

## Getting Started

Clone

```bash
yarn install
```

### Useful Commands

- `yarn build` - Build all packages including the XBallot interface
- `yarn dev` - Run all packages locally
- `yarn lint` - Lint all packages
- `yarn changeset-create` - Generate a changeset
- `yarn clean` - Clean up all `node_modules` and `dist` folders (runs each package's clean script)

## Apps & Packages

This Turborepo includes the following packages and applications:

- `apps/frontend`: The XBallot interface
- `apps/registrar`: The XBallot domain registrar
- `apps/worker`: The XBallot on-chain data aggregator
- `apps/indexer`: The XBallot on-chain account balance indexer
- `apps/api`: The XBallot api serving data from MongoDB
-
- `packages/sdk`: Unified SDK that incorporates schemas, functions, types, and more
- `packages/ts-config-xballot-monorepo`: Shared `tsconfig.json`s used throughout the Turborepo
- `packages/eslint-config-xballot-monorepo`: Shared eslint config

Yarn Workspaces enables us to "hoist" dependencies that are shared between packages to the root `package.json`. This means smaller `node_modules` folders and a better local dev experience. To install a dependency for the entire monorepo, use the `-W` workspaces flag with `yarn add`.

## Useful links

- [Frontend Deployment](https://xballot.net)
- [XBallot Indexer Swagger](https://indexer.mainnet.xballotapi.com/api-dev/v1)
