import type { FastifyBaseLogger } from 'fastify';
import { parseFile } from 'music-metadata';
import { Buffer } from 'node:buffer';
import { extname } from 'node:path';
import { format } from 'node:util';
import type { Sequelize } from 'sequelize';

import Audiobook from '~db/models/Audiobook.js';
import Author from '~db/models/Author.js';
import Narrator from '~db/models/Narrator.js';
import withLock from '~shared/withLock.js';

const importQueue = {
  queue: <
    [
      importFile: string,
      sequelize: Sequelize,
      log: FastifyBaseLogger,
      promise: PromiseWithResolvers<string | Audiobook>,
    ][]
  >[],
  processing: false,
  add(importFile: string, sequelize: Sequelize, log: FastifyBaseLogger): Promise<string | Audiobook> {
    const withResolvers = Promise.withResolvers<string | Audiobook>();
    this.queue.push([importFile, sequelize, log, withResolvers]);
    this.process();
    return withResolvers.promise;
  },
  async process() {
    if (this.processing) return;

    this.processing = true;
    while (this.queue.length) {
      const [importFile, sequelize, log, { resolve, reject }] = this.queue.shift()!;
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await handleBookImport([importFile, sequelize, log]);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }
    this.processing = false;
  },
};

const handleBookImport = async ([importFile, sequelize, log]: [
  importFile: string,
  sequelize: Sequelize,
  log: FastifyBaseLogger,
]): Promise<string | Audiobook> => {
  const {
    common: {
      album,
      title,
      picture: [{ data: cover, format: coverType } = { data: null, format: null }] = [],
      artists: authors,
      composer: narrators,
    },
    format: { duration = null },
  } = await parseFile(importFile, { duration: true });
  log.debug('parsed %s.', importFile);

  return withLock('db', async () => {
    const transaction = await sequelize.transaction();

    const name = title || album;
    if (!name) {
      log.error('No title for file %s. Skipping', importFile);
      return format('No title for file %s. Skipping', importFile);
    }
    log.info('Importing %s...', name);

    if (!authors?.length) throw new Error('Cannot import a book without authors');

    const authorRecords = await Promise.all(
      authors.map(async (author) => {
        const names = author.split(/ (?=[^ ]+$)/);
        const lastName = names.pop()!;
        const firstName = names[0] || null;
        const [auth] = await Author.findOrCreate({
          where: { firstName, lastName },
          transaction,
        });
        return auth;
      }),
    );

    const safeTitle = name.replace(/[/\\?%*:|"<>%]/g, '');
    const authorsString = authorRecords
      .toSorted((a, b) => a.lastName.localeCompare(b.lastName, undefined, { caseFirst: 'false' }))
      .map((auth) => [auth.firstName, auth.lastName].join(' ').replace(/[/\\?%*:|"<>%]/g, ''))
      .join(', ');
    const dir = `/audiobooks/${authorsString}/${safeTitle}`;
    const filename = `${safeTitle}${extname(importFile)}`;
    const filepath = `${dir}/${filename}`;

    const audiobook = await Audiobook.create(
      {
        cover: cover ? Buffer.from(cover) : null,
        coverType,
        filepath,
        title: name,
        duration: Number.isNaN(duration) ? null : duration,
        Authors: authorRecords,
      },
      { transaction },
    );

    if (narrators?.length) {
      let nars = narrators;
      if (nars.length === 1) {
        nars = nars[0]!.split(/,(?! *(?:jr\.?|sr\.?|junior|senior|i+v?|vi+)\b)/i);
      }

      await Promise.all(
        nars.map(async (narrator) => {
          const names = narrator.split(/ (?=[^ ]+$)/);
          const lastName = names.pop()!;
          const firstName = names[0] || null;
          const [narr] = await Narrator.findOrCreate({
            where: { firstName, lastName },
            transaction,
          });
          await audiobook.addNarrator(narr, { transaction });
        }),
      );
    }

    await transaction.commit();

    log.info('Done importing %s.', name);

    return audiobook;
  });
};

const importBook = (importFile: string, sequelize: Sequelize, log: FastifyBaseLogger) =>
  importQueue.add(importFile, sequelize, log);

export default importBook;
