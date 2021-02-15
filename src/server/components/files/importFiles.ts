import { promises } from 'fs';
import { parseFile } from 'music-metadata';
import { extname } from 'path';

export const supportedFileExtensions = ['.m4a', '.m4b', '.mp4', '.mp3'];

const importFiles = async (files: string[]) => {
  return files.map(async (file) => {
    if (!supportedFileExtensions.includes(extname(file))) return;

    const st = await promises.stat(file);
    if (!st.isFile) return;

    const md = await parseFile(file);

    console.log(md.common.picture);
  });
};

export default importFiles;
