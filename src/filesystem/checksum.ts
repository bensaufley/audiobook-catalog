import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

const checksum = (path: string, ...args: Parameters<typeof createHash>) =>
  new Promise((resolve, reject) => {
    const hash = createHash(...args);
    createReadStream(path)
      .on('data', (chunk) => hash.update(chunk))
      .once('error', reject)
      .once('close', () => {
        resolve(hash.digest('hex'));
      });
  });

export default checksum;
