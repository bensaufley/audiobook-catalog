import { Server } from 'http';
import { Db } from 'mongodb';

import create from '~server/create';
import { setUpDB } from '~spec/support/spec-helpers';

describe('~server/create', () => {
  let db: Db;
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    [{ db }, teardown] = await setUpDB();
  });

  afterEach(async () => {
    await teardown();
  });

  it('starts successfully', async () => {
    const app = await create(db);

    let server: Server;
    setTimeout(() => {
      server.close();
    });

    server = app.listen(9999);
  });
});
