import { bareLogger } from '~server/logging.js';

const withRetries = <R>(retries: number, cb: () => Promise<R>): Promise<R> =>
  cb().catch((err) => {
    if (retries <= 0) throw err;
    bareLogger.warn({ err, retries }, 'Retrying...');
    return withRetries(retries - 1, cb);
  });

export default withRetries;
