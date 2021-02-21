import checkForImports from '~server/components/files/checkForImports';
import checkForUpdates from '~server/components/files/checkForUpdates';

const poll = async () => {
  const period = Number(process.env.POLL_PERIOD) || 60_000;

  await checkForImports();
  await checkForUpdates();

  return setTimeout(poll, period);
};

export default poll;
