import 'core-js/stable';

import getClient from '~server/components/db/getClient';
import poll from '~server/components/files/poll';
import create from '~server/create';

/* eslint-disable-next-line consistent-return */
const start = async () => {
  try {
    const importProcess = await poll();
    const client = await getClient();
    client.close();
    const app = await create();
    const port = process.env.PORT || '8080';
    console.log(`Listening on port ${port}`);
    const server = app.listen(port);
    return { importProcess, server };
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

let processes = start();

if (module.hot) {
  module.hot.accept('./index.ts', () => {
    processes.then(({ importProcess, server }) => {
      if (importProcess) clearTimeout(importProcess);
      server.close();
      processes = start();
    });
  });
}
