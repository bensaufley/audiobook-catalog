import { Db } from 'mongodb';

import checkForImports from '~server/components/files/checkForImports';
import cleanup from '~server/components/files/cleanup';
import handleImports from '~server/components/files/handleImports';
import glob, { supportedFileExtensions } from '~server/components/files/utilities/glob';

const poll = async (db: Db) => {
  if (!process.env.IMPORTS_PATH) {
    console.warn('No IMPORTS_PATH set');
    return undefined;
  }

  const filesGlob = `${process.env.IMPORTS_PATH}/**/*{${supportedFileExtensions.join(',')}}`;

  const period = Number(process.env.POLL_PERIOD) || 60_000;
  const files = await glob(filesGlob);

  await checkForImports(files, db);
  await handleImports(db);
  const dirs = await glob(`${process.env.IMPORTS_PATH}/{*/**,*.*}`, {
    ignore: [filesGlob, process.env.IMPORTS_PATH],
  });
  await cleanup(dirs);

  return setTimeout(() => {
    poll(db);
  }, period);
};

export default poll;
