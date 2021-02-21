import 'core-js/stable';

import { pingClient } from '~server/components/db/getClient';
import init from '~server/components/db/init';
import poll from '~server/components/files/poll';
import create from '~server/create';

/* eslint-disable-next-line consistent-return */
const start = async () => {
  try {
    await pingClient();
    await init();
    const importProcess = poll();
    const app = await create();
    const port = process.env.PORT || '8080';
    console.log(`Listening on port ${port}`);
    const server = app.listen(port);
    return { importProcess: await importProcess, server };
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

let processes = start();

if (module.hot) {
  module.hot.accept('~server', async () => {
    const { importProcess, server } = await processes;
    if (importProcess) clearTimeout(importProcess);
    server.close();
    processes = start();
  });
  module.hot.accept();
}
