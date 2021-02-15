import { promises } from 'fs';
import { parseFile } from 'music-metadata';
import { extname } from 'path';

import walk from '~server/components/files/walk';

export const supportedFileExtensions = ['.m4a', '.m4b', '.mp4', '.mp3'];

const checkForImports = async () => {
  if (!process.env.IMPORTS_PATH) {
    console.warn('No IMPORTS_PATH set');
    return;
  }

  try {
    const files = await walk(process.env.IMPORTS_PATH);
    await Promise.all(
      files.map(async (file) => {
        if (!supportedFileExtensions.includes(extname(file))) return;

        const st = await promises.stat(file);
        if (!st.isFile) return;

        const md = await parseFile(file);

        console.log(md.common.picture);
      })
    );
  } catch (err) {
    console.error('Error importing from', process.env.IMPORTS_PATH, '-', err);
  }
};

const poll = async () => {
  const period = Number(process.env.POLL_PERIOD) || 60_000;

  await checkForImports();

  return setTimeout(checkForImports, period);
};

export default poll;
