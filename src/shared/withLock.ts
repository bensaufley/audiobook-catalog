class Queue {
  private stack: (() => Promise<void>)[] = [];

  private running = false;

  public push(fn: () => Promise<void>) {
    this.stack.push(fn);
    this.process();
  }

  private async process() {
    if (this.running) return;

    this.running = true;
    while (this.stack.length) await this.stack.shift()!(); // eslint-disable-line no-await-in-loop
    this.running = false;
  }
}

const queues: Record<string, Queue> = {};

const withLock = async <T>(queue: string, fn: () => Promise<T>): Promise<T> => {
  const { promise, resolve, reject } = Promise.withResolvers<T>();
  queues[queue] ??= new Queue();
  queues[queue].push(async () => {
    try {
      resolve(await fn());
    } catch (err) {
      reject(err);
    }
  });
  return promise;
};

export default withLock;
