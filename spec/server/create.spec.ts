import { Server } from 'http';

import create from '~server/create';

describe('~server/create', () => {
  it('starts successfully', async () => {
    const app = await create();

    let server: Server;
    setTimeout(() => {
      server.close();
    });

    server = app.listen(9999);
  });
});
