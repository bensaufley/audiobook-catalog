import { stat } from 'fs/promises';
import { extname } from 'path';

import { ImportStatus } from '~graphql/schema';
import { getCollections } from '~server/components/db/getCollection';
import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';
import { supportedFileExtensions } from '~server/components/files/utilities/glob';

const checkForImports = async (files: string[]) => {
  const [client, audiobooks, toImport] = await getCollections('audiobooks', 'toImport');

  try {
    let i = 0;
    await Promise.all(
      files.map(async (file) => {
        if (!supportedFileExtensions.includes(extname(file))) return;
        i += 1;
        const n = i;

        try {
          const st = await stat(file);
          if (!st.isFile) return;

          console.log(n, 'adding to import queue', file);

          const metadata = await getAudiobookMetadata(file, { stat: st });

          const existing = await audiobooks.findOne({
            filepath: { $eq: new RegExp(`/${metadata.name}$`) },
          });

          const resp = await toImport.updateOne(
            {
              filepath: { $eq: file },
            },
            {
              $set: {
                filepath: file,
                name: metadata.name,
                meta: {
                  checksum: metadata.checksum,
                },
                status: !existing ? ImportStatus.Pending : ImportStatus.Conflict,
              },
            },
            {
              upsert: true,
            },
          );
          console.log(n, 'imported', file, 'response:', resp.result);
        } catch (err) {
          console.error(n, err);
        }
      }),
    );
  } catch (err) {
    console.error('Error importing from', process.env.IMPORTS_PATH, '-', err);
  }
  await client.close();
  console.log('done checkForImports');
};

export default checkForImports;
