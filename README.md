# Audiobook Catalog

A Docker container for cataloging audiobooks, intended for use on an [Unraid] server.

# Environment Variables

- `POLL_PERIOD`: Optional. Number of time in ms between checking for new imports. Defaults to 60,000.
- `IMPORTS_PATH`: Nominally optional, but will cause warnings if missing. Path within docker container to which the directory for audiobooks to import is mounted.
- `STORAGE_PATH`: Required. path within docker container to which the directory where audiobook files managed by the container will be stored. **Must** be different from `IMPORTS_PATH`.

# Development

## Scripts

- `script/setup`: builds Dev docker container
- `script/server`: runs `script/setup` and then starts it. Server will be visible at <http://localhost:6541> and Graphiql Playground will be available at <http://localhost:6451/graphql>. Also exposes <http://localhost:27451> which maps to port 27017 on the docker container, which can be used for connecting directly to the Mongo database. This port is not/should not be exposed in a prod container.
- `script/test`: runs `script/setup` and runs `yarn test` inside it. Extra arguments will be passed as arguments to `yarn test`, e.g. `script/test -u` to update Jest snapshots.
- `script/make-tests`: tries to stub basic test files for any files that don't currently have them.

[unraid]: https://unraid.net
