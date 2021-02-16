import checkForImports from '~server/components/files/checkForImports';

const poll = async () => {
  const period = Number(process.env.POLL_PERIOD) || 60_000;

  await checkForImports();

  return setTimeout(checkForImports, period);
};

export default poll;
