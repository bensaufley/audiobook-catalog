import checkForImports from '~server/components/files/checkForImports';
import handleImports from '~server/components/files/handleImports';

const poll = async () => {
  const period = Number(process.env.POLL_PERIOD) || 60_000;

  await checkForImports();
  await handleImports();

  return setTimeout(poll, period);
};

export default poll;
