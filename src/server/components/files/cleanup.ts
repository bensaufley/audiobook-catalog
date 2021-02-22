import { rm, rmdir, stat } from 'fs/promises';

import glob, { supportedFileExtensions } from '~server/components/files/utilities/glob';

const cleanup = async (paths: string[]) => {
  console.log('starting cleanup');

  await Promise.all(
    paths.map(async (p) => {
      try {
        const st = await stat(p);

        if (st.isDirectory()) {
          const filesForImport = await glob(`${p}/**/*.${supportedFileExtensions.join(',')}`);
          if (filesForImport.length) return;

          console.log('removing directory with no remaining imports', p);
          await rmdir(p, { recursive: true });
          console.log('removed directory', p);
        } else {
          await rm(p);
        }
      } catch (err) {
        console.warn('error attempting to clean up', p, err);
      }
    }),
  );

  console.log('completed cleanup');
};

export default cleanup;
