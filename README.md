# Audiobook Catalog

<a href="https://codeclimate.com/github/bensaufley/audiobook-catalog/maintainability"><img src="https://api.codeclimate.com/v1/badges/7d1a08f5078be7a031de/maintainability" /></a>
<a href="https://codeclimate.com/github/bensaufley/audiobook-catalog/test_coverage"><img src="https://api.codeclimate.com/v1/badges/7d1a08f5078be7a031de/test_coverage" /></a>

A Docker container for cataloging audiobooks, intended for use on an [Unraid] server.

# Environment Variables

- `LOG_LEVEL`: Optional. Passed to pino. Sanitized: options are `trace`, `debug`, `info`, `warn`, `error`. Defaults to `info`.
- `POLL_PERIOD`: Optional. Number of time in ms between checking for new imports. Defaults to 30,000.

# Mount Paths

Audiobooks should be mounted at `/audiobooks`.

The directory where 

# Development

`.audiobooks` will be mounted at `/audiobooks` and is gitignored; you can use it to work in a local environment.

## Scripts

This repo adhere's to GitHub's [Scripts to Rule Them All] pattern.

- `script/setup`: creates a new Docker image for dev, ignoring cache
- `script/update`: builds the dev Docker image, using cache if possible. In most cases, `script/update` is all you need and `script/setup` is unnecessary.
- `script/migrate`: exposes the [Umzug] CLI inside the dev container. If no arguments are passed, `up` is assumed.
- `script/server`: runs `script/update` and then starts dev server inside generated Docker image. Server will be visible at <http://localhost:6541>.
- `script/test`: runs `script/update` and runs `yarn test` inside it. Extra arguments will be passed as arguments to `yarn test`, e.g. `script/test -u` to update Jest snapshots.

[unraid]: https://unraid.net
[scripts to rule them all]: https://github.com/github/scripts-to-rule-them-all
[umzug]: https://github.com/sequelize/umzug