import { watch } from 'chokidar';
import type { FastifyBaseLogger } from 'fastify';
import { existsSync, rmSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import type { Sequelize } from 'sequelize';

import type Audiobook from '~db/models/Audiobook.js';
import checksum from '~server/filesystem/checksum.js';
import importBook from '~server/filesystem/importBook.js';

const extensions = ['.m4a', '.m4b'];

const addBook = (sequelize: Sequelize, log: FastifyBaseLogger) => async (path: string) => {
  if (!extensions.includes(extname(path))) return null;

  log.info('New file found in /imports: %s', path);
  let audiobook: Audiobook | undefined;
  return importBook(path, sequelize, log)
    .then(async (result) => {
      if (typeof result === 'string') {
        const flag = existsSync('/import/errors.txt') ? 'a' : 'w';
        await writeFile('/import/errors.txt', `${path} [${new Date().toISOString()}]: ${result}\n`, { flag });
        return;
      }
      audiobook = result;

      const safeTitle = result.title.replace(/[/\\?%*:|"<>%]/g, '');
      const authors = (await result.getAuthors())
        .toSorted((a, b) => a.lastName.localeCompare(b.lastName, undefined, { caseFirst: 'false' }))
        .map((auth) => [auth.firstName, auth.lastName].join(' ').replace(/[/\\?%*:|"<>%]/g, ''))
        .join(', ');
      const dir = `/audiobooks/${authors}/${safeTitle}`;
      await mkdir(dir, { recursive: true });
      const newFile = `${dir}/${safeTitle}${extname(path)}`;
      await copyFile(path, newFile);

      log.debug('Copied %s to %s.', path, newFile);
      const [orig, cp] = await Promise.all([checksum(path, 'sha256'), checksum(newFile, 'sha256')]);
      log.debug('Checksums: %s, %s', orig, cp);
      if (orig !== cp) {
        log.error('Checksum mismatch for %s. Deleting copy.', path);
        rmSync(newFile);
        await writeFile('/import/errors.txt', `${path} [${new Date().toISOString()}]: Checksum mismatch\n`, {
          flag: 'a',
        });
        return;
      }

      rmSync(path);

      log.info('Imported %s to %s.', path, newFile);
    })
    .catch(async (err) => {
      log.error({ err }, 'Error importing %s', path);
      await audiobook?.destroy().catch((e) => {
        log.error({ err: e }, 'Error deleting audiobook');
      });
      const msg = err instanceof Error ? err.message : String(err);
      const flag = existsSync('/import/errors.txt') ? 'a' : 'w';
      await writeFile('/import/errors.txt', `${path} [${new Date().toISOString()}]: Error when importing: ${msg}\n`, {
        flag,
      });
    });
};

const start = (sequelize: Sequelize, log: FastifyBaseLogger) => {
  const watcher = watch('/import/*', {
    awaitWriteFinish: true,
    followSymlinks: false,
  });

  watcher.on('add', addBook(sequelize, log));

  log.info({ watched: watcher.getWatched() }, 'Watching for new files.');

  return async () => {
    await watcher.close();
  };
};

export default start;
