import type { Stats } from 'fs';
import { readdir, stat } from 'fs/promises';
import { join, normalize } from 'path';

const walk = async (directory: string, cb: (path: string, stats: Stats) => void | Promise<void>) => {
  const files = await readdir(directory);

  await Promise.all(
    files.map(async (file) => {
      const path = normalize(join(directory, file));
      if (!path.startsWith(directory)) return;

      const stats = await stat(path);

      if (stats.isDirectory()) {
        walk(path, cb);
      } else {
        cb(path, stats);
      }
    }),
  );
};

export default walk;
