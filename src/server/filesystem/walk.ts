import { readdir, stat } from 'fs/promises';
import { join, normalize } from 'path';

const walk = async (directory: string): Promise<string[]> => {
  const files = await readdir(directory);

  const walked = await Promise.all(
    files.map(async (file): Promise<string | string[] | null> => {
      const path = normalize(join(directory, file));
      if (!path.startsWith(directory)) return null;

      const stats = await stat(path);

      if (stats.isDirectory()) {
        const files = await walk(path);
        return files;
      } else {
        return path;
      }
    }),
  );

  return walked.reduce<string[]>((a, f) => {
    if (f === null) return a;

    return Array.isArray(f) ? [...a, ...f] : [...a, f];
  }, []);
};

export default walk;
