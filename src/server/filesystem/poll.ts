import { FastifyLoggerInstance } from 'fastify';
import type { Stats } from 'fs';
import { extname } from 'path';
import type { Sequelize } from 'sequelize';
import { parseFile } from 'music-metadata';

import walk from '~server/filesystem/walk';
import { wait } from '~shared/utilities';
import Audiobook from '~db/models/Audiobook';
import Author from '~db/models/Author';
import Narrator from '~db/models/Narrator';

const extensions = ['.m4a', '.m4b'];

const poll = async (sequelize: Sequelize, log: FastifyLoggerInstance, directory: string, pollPeriod: number) => {
  try {
    log.info('Walking %s...', directory);
    await walk(directory, async (filepath: string, stats: Stats) => {
      if (!extensions.includes(extname(filepath))) return;

      if (await Audiobook.findOne({ where: { filepath } })) return;

      const {
        common: {
          title,
          picture: [{ data: cover, format: coverType } = { data: null, format: null }] = [],
          artists: authors,
          composer: narrators,
        },
        format: { duration = null },
      } = await parseFile(filepath, { duration: true });

      const transaction = await sequelize.transaction();

      if (!title) {
        log.error('No title for file %s. Skipping', filepath);
        return;
      }

      const audiobook = new Audiobook({
        cover,
        coverType,
        filepath,
        title,
        duration: Number.isNaN(duration) ? null : duration,
      });

      await audiobook.save({ transaction });

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
          nars = nars[0].split(/,(?! *(?:jr\.?|sr\.?|junior|senior|i+v?|vi+)\b)/i);
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
    });
    log.info('Done walking %s.', directory);
  } catch (error) {
    log.error({ error }, 'Error walking %s');
  }
  await wait(pollPeriod);

  setImmediate(() => poll(sequelize, log, directory, pollPeriod));
};

export default poll;
