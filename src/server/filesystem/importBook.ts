import type { FastifyBaseLogger } from 'fastify';
import { parseFile } from 'music-metadata';
import { Buffer } from 'node:buffer';
import { extname } from 'node:path';
import { format } from 'node:util';
import { Op, type Sequelize, type Transaction } from 'sequelize';

import Audiobook from '~db/models/Audiobook.js';
import Author from '~db/models/Author.js';
import Narrator from '~db/models/Narrator.js';
import withRetries from '~server/utils/withRetries.js';

const buildAuthors = async (raw: string[], transaction: Transaction) => {
  const names = raw.map((author) => {
    const names = author.split(/ (?=[^ ]+$)/);
    const lastName = names.pop()!;
    const firstName = names[0] || null;
    return { firstName, lastName };
  });
  const existingAuthors = await Author.findAll({ where: { [Op.or]: names }, transaction });
  const authorsToAdd = names.filter(
    (auth) => !existingAuthors.some((a) => a.firstName === auth.firstName && a.lastName === auth.lastName),
  );
  const addedAuthors = await Author.bulkCreate(authorsToAdd, { transaction });
  return [...existingAuthors, ...addedAuthors];
};

const buildNarrators = async (raw: string[] | undefined, transaction: Transaction) => {
  if (!raw?.length) return [];
  const splitRaw = raw.length === 1 ? raw[0]!.split(/,(?! *(?:jr\.?|sr\.?|junior|senior|i+v?|vi+)\b)/i) : raw;

  const names = splitRaw.map((narrator) => {
    const names = narrator.split(/ (?=[^ ]+$)/);
    const lastName = names.pop()!;
    const firstName = names[0] || null;
    return { firstName, lastName };
  });
  const existingNarrators = await Narrator.findAll({ where: { [Op.or]: names }, transaction });
  const narratorsToAdd = names.filter(
    (auth) => !existingNarrators.some((a) => a.firstName === auth.firstName && a.lastName === auth.lastName),
  );
  const addedNarrators = await Narrator.bulkCreate(narratorsToAdd, { transaction });
  return [...existingNarrators, ...addedNarrators];
};

let importing = false;

const importBook = async (
  importFile: string,
  sequelize: Sequelize,
  log: FastifyBaseLogger,
): Promise<string | Audiobook> => {
  const waitStart = Date.now();
  while (importing) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 1_000);
    });
    if (Date.now() - waitStart >= 60_000) {
      throw new Error('Timed out waiting for prior import to finish');
    }
  }
  importing = true;

  try {
    const resp = await withRetries(async () => {
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

      const transaction = await sequelize.transaction();
      try {
        const name = title || album;
        if (!name) {
          log.error('No title for file %s. Skipping', importFile);
          return format('No title for file %s. Skipping', importFile);
        }
        log.info('Importing %s...', name);

        if (!authors?.length) throw new Error('Cannot import a book without authors');

        const authorRecords = await buildAuthors(authors, transaction);
        const narratorRecords: Narrator[] = await buildNarrators(narrators, transaction);

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
          },
          { transaction },
        );
        await audiobook.addAuthors(authorRecords, { transaction });
        if (narratorRecords.length) await audiobook.addNarrators(narratorRecords, { transaction });

        await transaction.commit();

        log.info('Done importing %s.', name);

        return audiobook;
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    }, 5);

    return resp;
  } finally {
    importing = false;
  }
};

export default importBook;
