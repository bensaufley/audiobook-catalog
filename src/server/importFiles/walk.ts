/* eslint-disable no-restricted-syntax */
import { promises } from 'fs';
import { join } from 'path';

export default async function* walk(dir: string): AsyncGenerator<string, void, void> {
  for await (const d of await promises.opendir(dir)) {
    const entry = join(dir, d.name);
    if (d.isDirectory()) yield* walk(entry);
    else if (d.isFile()) yield entry;
  }
}
