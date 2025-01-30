import { bareLogger } from '~server/logging.js';
import { wait } from '~shared/utilities.js';

const withRetries = <R>(cb: () => Promise<R>, totalRetries = 3, backoff = 1.2, retries = totalRetries): Promise<R> =>
  cb().catch(async (err) => {
    if (retries - 1 <= 0) throw err;

    const timeout = 1_000 * backoff ** (totalRetries - retries);
    bareLogger.warn(
      { err, timeout, try: totalRetries - retries + 1 },
      'Error in operation (attempt %d). Will retry in %dms',
      totalRetries - retries + 1,
      timeout,
    );
    await wait(timeout);
    return withRetries(cb, totalRetries, backoff, retries - 1);
  });

export default withRetries as <R>(cb: () => Promise<R>, retries?: number, backoff?: number) => Promise<R>;
