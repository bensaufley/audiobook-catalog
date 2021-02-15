import { Dirent, promises } from 'fs';
import { join } from 'path';

export default async function walk(dir: string): Promise<string[]> {
  const directories: Dirent[] = [];
  for await (const d of await promises.opendir(dir)) {
    directories.push(d);
  }
  const list = await Promise.all(
    [...directories].map(async (d) => {
      const entry = join(dir, d.name);
      if (d.isDirectory()) return walk(entry);
      return entry;
    })
  );
  return list.reduce<string[]>((arr, e) => [...arr, ...(Array.isArray(e) ? e : [e])], []);
}
