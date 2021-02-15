import importFiles from '~server/components/files/importFiles';
import walk from '~server/components/files/walk';

const checkForImports = async () => {
  if (!process.env.IMPORTS_PATH) {
    console.warn('No IMPORTS_PATH set');
    return;
  }

  try {
    await importFiles(await walk(process.env.IMPORTS_PATH));
  } catch (err) {
    console.error('Error importing from', process.env.IMPORTS_PATH, '-', err);
  }
};

const poll = async () => {
  const period = Number(process.env.POLL_PERIOD) || 60_000;

  await checkForImports();

  return setTimeout(checkForImports, period);
};

export default poll;
