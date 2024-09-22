<h1><img src="https://raw.githubusercontent.com/bensaufley/audiobook-catalog/main/audiobook-catalog.png" alt="Audiobook Catalog logo" style="float: left;margin-right: 1rem; width: 2rem; height: 2rem; vertical-align: middle">
Audiobook Catalog</h1>

<a href="https://codeclimate.com/github/bensaufley/audiobook-catalog/maintainability"><img src="https://api.codeclimate.com/v1/badges/7d1a08f5078be7a031de/maintainability" /></a>
<a href="https://codeclimate.com/github/bensaufley/audiobook-catalog/test_coverage"><img src="https://api.codeclimate.com/v1/badges/7d1a08f5078be7a031de/test_coverage" /></a>

A Docker container for cataloging audiobooks, intended for use on an [Unraid]
server. Uses [Sequelize] with a [SQLite] database and [Fastify] on the backend,
and [Preact] on the frontend.

# Environment Variables

- `LOG_LEVEL`: Optional. Passed to pino. Sanitized: options are `trace`,
  `debug`, `info`, `warn`, `error`. Defaults to `info`.

# Mount Paths

- The directory for audiobooks to be organized and stored should be mounted at
  `/audiobooks`.
- The directory where the database will be stored should be mounted at `/db`.
- The directory where imports go should be mounted at `/import`.

# Utilities

Certain command-line utilities are included in the container (located at
`.build/bin`). They will respond to `-h`/`--help` for more information:

- `removeTag`: For safety, tags can only be deleted through the UI if they are
  not associated with any audiobooks. This utility can be used to remove one or
  multiple tags, including those associated with audiobooks (with `-f`).

# Development

`.audiobooks` and `.import` will be mounted at `/audiobooks` and `/import`
respectively, and are gitignored; you can use them to work in a local
environment.

## Scripts

This repo adhere's to GitHub's [Scripts to Rule Them All] pattern.

- `script/cmd`: executes a Docker command with all the extra configuration
  needed for this project. Most other scripts use `script/cmd` under the hood.
- `script/setup`: creates a new Docker image for dev, ignoring cache
- `script/update`: builds the dev Docker image, using cache if possible. In most
  cases, `script/update` is all you need and `script/setup` is unnecessary.
- `script/migrate`: exposes the [Umzug] CLI inside the dev container. If no
  arguments are passed, `up` is assumed.
- `script/server`: runs `script/update` and then starts dev server inside
  generated Docker image. Server will be visible at <http://localhost:6541>.
- `script/test`: runs `script/update` and runs `npm test` inside it. Extra
  arguments will be passed as arguments to `npm test`, e.g. `script/test -u` to
  update Jest snapshots.

[sequelize]: https://sequelize.org
[sqlite]: https://www.sqlite.org
[fastify]: https://www.fastify.io
[preact]: https://preactjs.com
[unraid]: https://unraid.net
[scripts to rule them all]: https://github.com/github/scripts-to-rule-them-all
[umzug]: https://github.com/sequelize/umzug
