import { createDirSync } from 'mktemp';

import { collectTeardowns, stubEnvVar } from '~test/support/test-helpers';

describe('~server/init', () => {
  let teardowns: () => void;

  beforeEach(() => {
    const dbDir = createDirSync('test-db-dir');
    teardowns = collectTeardowns(stubEnvVar('DB_DIR', dbDir));
  });

  it.todo('write some tests');
});
