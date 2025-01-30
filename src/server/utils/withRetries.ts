import { bareLogger } from '~server/logging.js';
import { wait } from '~shared/utilities.js';

const withRetries = <R>(cb: () => Promise<R>, totalRetries = 3, backoff = 1.2, retries = totalRetries): Promise<R> =>
  cb().catch(async (err) => {
    if (retries <= 0) throw err;
    bareLogger.warn({ err, retries }, 'Retrying...');
    await wait(1_000 * backoff ** (totalRetries - retries));
    return withRetries(cb, totalRetries, backoff, retries - 1);
  });

export default withRetries as <R>(cb: () => Promise<R>, retries?: number, backoff?: number) => Promise<R>;
