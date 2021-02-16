import { createHash } from 'crypto';
import { createReadStream } from 'fs';

// https://wellingguzman.com/notes/node-checksum
const getChecksum = (path: string) =>
  new Promise<string>((resolve, reject) => {
    // crypto.createHash('sha1');
    // crypto.createHash('sha256');
    const hash = createHash('sha512');
    const input = createReadStream(path);

    input.on('error', reject);

    input.on('data', (chunk) => {
      hash.update(chunk);
    });

    input.on('close', () => {
      resolve(hash.digest('hex'));
    });
  });

export default getChecksum;
