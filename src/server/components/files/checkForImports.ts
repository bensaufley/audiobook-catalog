import { promises } from 'fs';
import { extname } from 'path';

import getCollection from '~server/components/db/getCollection';
import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';
import walkDirectory from '~server/components/files/utilities/walkDirectory';

export const supportedFileExtensions = ['.m4a', '.m4b', '.mp4', '.mp3'];

const checkForImports = async () => {
  if (!process.env.IMPORTS_PATH) {
    console.warn('No IMPORTS_PATH set');
    return;
  }

  const audiobooks = await getCollection('audiobooks');
  const toImport = await getCollection('toImport');

  try {
    const files = await walkDirectory(process.env.IMPORTS_PATH);
    let i = 0;
    await Promise.all(
      files.map(async (file) => {
        if (!supportedFileExtensions.includes(extname(file))) return;
        i += 1;
        const n = i;

        try {
          const st = await promises.stat(file);
          if (!st.isFile) return;

          console.log(n, 'adding to import queue', file);

          const metadata = await getAudiobookMetadata(file, { stat: st });

          const existing = await audiobooks.findOne({
            name: { $eq: metadata.name },
          });

          const conflict = !!existing;

          await toImport.updateOne(
            {
              filepath: { $eq: file },
            },
            {
              $set: {
                conflict,
                filepath: file,
                name: metadata.name,
                meta: {
                  checksum: metadata.checksum,
                },
              },
            },
            {
              upsert: true,
            }
          );
        } catch (err) {
          console.error(n, err);
        }
      })
    );
  } catch (err) {
    console.error('Error importing from', process.env.IMPORTS_PATH, '-', err);
  }
};

export default checkForImports;
