import type { FastifyLoggerInstance } from 'fastify';
import { parseFile } from 'music-metadata';
import type { Sequelize } from 'sequelize';

import Audiobook from '~db/models/Audiobook';
import Author from '~db/models/Author';
import Narrator from '~db/models/Narrator';

const importBook = async (filepath: string, sequelize: Sequelize, log: FastifyLoggerInstance) => {
  log.debug('checking for %s...', filepath);
  if (await Audiobook.findOne({ where: { filepath } })) {
    log.debug('found existing Audiobook for %s; skipping.', filepath);
    return;
  }
  log.debug('no entry for %s. Parsing file.', filepath);

  const {
    common: {
      album,
      title,
      picture: [{ data: cover, format: coverType } = { data: null, format: null }] = [],
      artists: authors,
      composer: narrators,
    },
    format: { duration = null },
  } = await parseFile(filepath, { duration: true });
  log.debug('parsed %s.', filepath);

  const transaction = await sequelize.transaction();

  const name = title || album;
  if (!name) {
    log.error('No title for file %s. Skipping', filepath);
    return;
  }
  log.info('Importing %s...', name);

  const audiobook = await Audiobook.create(
    {
      cover,
      coverType,
      filepath,
      title: name,
      duration: Number.isNaN(duration) ? null : duration,
    },
    { transaction },
  );

  await Promise.all(
    authors?.map(async (author) => {
      const names = author.split(/ (?=[^ ]+$)/);
      const lastName = names.pop()!;
      const firstName = names[0] || null;
      const [auth] = await Author.findOrCreate({
        where: { firstName, lastName },
        transaction,
      });
      await audiobook.addAuthor(auth, { transaction });
    }) || [],
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
};

export default importBook;
