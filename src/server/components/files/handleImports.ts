import { existsSync, promises } from 'fs';
import { resolve } from 'path';

import { ImportStatus } from '~graphql/schema';
import { getCollections } from '~server/components/db/getCollection';
import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';

const handleImports = async () => {
  const storagePath = process.env.STORAGE_PATH;
  if (!existsSync(storagePath)) throw new Error('invalid STORAGE_PATH');
  const st = await promises.stat(storagePath);
  if (!st.isDirectory()) throw new Error('invalid STORAGE_PATH');

  console.log('starting handleImports');
  const [client, audiobooks, audiobookAuthors, auths, toImport] = await getCollections(
    'audiobooks',
    'audiobookAuthors',
    'authors',
    'toImport',
  );

  let i = 0;

  const imports = await toImport.find();

  const importProcesses = imports.map(async ({ _id, filepath, status }) => {
    i += 1;
    console.log(i, 'handling import for', filepath, '- status: ', status);
    if (status === ImportStatus.Conflict) return;

    await toImport.updateOne({ _id: { $eq: _id } }, { $set: { status: ImportStatus.Pending } });

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

      const storageFilepath = resolve(storagePath, md.filename);

      const audiobook = await audiobooks.insertOne({
        cover: md.cover,
        duration: md.duration,
        filepath: storageFilepath,
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

      await promises.copyFile(filepath, storageFilepath);
      await promises.rm(filepath);

      await toImport.updateOne(
        { _id: { $eq: _id } },
        { $set: { status: ImportStatus.Done, error: undefined } },
      );
    } catch (err) {
      console.error('error handling import', _id, filepath, err);
      await toImport.updateOne(
        { _id: { $eq: _id } },
        { $set: { status: ImportStatus.Error, error: err.toString() } },
      );
    }
  });
  await Promise.all(await importProcesses.toArray());

  await client.close();

  console.log('done handleImports');
};

export default handleImports;
