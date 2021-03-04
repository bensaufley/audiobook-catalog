import { existsSync, promises } from 'fs';
import { Db } from 'mongodb';
import { resolve } from 'path';

import { ImportStatus } from '~graphql/schema.generated';
import { getCollections } from '~server/components/db/getCollection';
import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';

const handleImports = async (db: Db) => {
  const storagePath = process.env.STORAGE_PATH;
  if (!existsSync(storagePath)) throw new Error('invalid STORAGE_PATH');
  const st = await promises.stat(storagePath);
  if (!st.isDirectory()) throw new Error('invalid STORAGE_PATH');

  console.log('starting handleImports');
  const [audiobooks, audiobookAuthors, auths, imports] = await getCollections(
    db,
    'audiobooks',
    'audiobookAuthors',
    'authors',
    'imports',
  );

  let i = 0;

  const toImport = await imports.find();

  const importProcesses = toImport.map(async ({ _id, filepath, status }) => {
    i += 1;
    console.log(i, 'handling import for', filepath, '- status: ', status);
    if (status === ImportStatus.Conflict) return;

    await imports.updateOne({ _id: { $eq: _id } }, { $set: { status: ImportStatus.Pending } });

    try {
      const md = await getAudiobookMetadata(filepath, { duration: true });

      const authorIDs = await Promise.all(
        md.authors.map(async (author) => {
          const a = await auths.findOneAndUpdate(
            {
              firstName: { $eq: author.firstName },
              lastName: { $eq: author.lastName },
            },
            { $set: { firstName: author.firstName } },
            { upsert: true, returnOriginal: false },
          );
          return a.value!._id;
        }),
      );

      const audiobook = await audiobooks.insertOne({
        cover: md.cover,
        duration: md.duration,
        filename: md.filename,
        genres: [],
        name: md.name,
        year: md.year,
        meta: { checksum: md.checksum },
      });
      await audiobookAuthors.insertMany(
        authorIDs.map((author, j) => ({
          author,
          audiobook: audiobook.insertedId,
          meta: md.authors[j]?.meta ?? null,
        })),
      );

      await promises.copyFile(filepath, resolve(storagePath, md.filename));
      await promises.rm(filepath);

      await imports.updateOne(
        { _id: { $eq: _id } },
        { $set: { status: ImportStatus.Done, error: undefined } },
      );
    } catch (err) {
      console.error('error handling import', _id, filepath, err);
      await imports.updateOne(
        { _id: { $eq: _id } },
        { $set: { status: ImportStatus.Error, error: err.toString() } },
      );
    }
  });
  await Promise.all(await importProcesses.toArray());

  console.log('done handleImports');
};

export default handleImports;
