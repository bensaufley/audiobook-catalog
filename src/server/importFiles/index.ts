import { promises } from 'fs';
import { parseFile } from 'music-metadata';
import { extname } from 'path';

export const supportedFileExtensions = ['.m4a', '.m4b', '.mp4', '.mp3'];

const importFiles = async (dir: AsyncGenerator<string, void, void>) => {
  for await (const file of dir) {
    if (!supportedFileExtensions.includes(extname(file))) continue;

    const st = await promises.stat(file);
    if (!st.isFile) continue;

    const md = await parseFile(file);

    // if (md.common.picture) {
    // }
  }
};

export default importFiles;
