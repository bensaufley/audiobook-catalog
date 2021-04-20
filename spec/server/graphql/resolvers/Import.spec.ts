import { Db, ObjectID } from 'mongodb';

import Import from '~server/graphql/resolvers/Import';
import type { ImportDbObject } from '~server/mongoTypes';
import { gqlInfo, setUpDB } from '~spec/support/spec-helpers';

describe('~server/graphql/resolvers/Import', () => {
  let importObj: ImportDbObject;
  let db: Db;
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    importObj = {
      _id: new ObjectID('036ca3526c92bb2b555a3254'),
      filepath: '/imports/my-new-audiobook.m4b',
      name: 'How to Import Your Audiobooks',
      lastModified: new Date(2020, 7, 29),
      status: 'pending',
      error: null,
      meta: {
        checksum: 'asdfbsdf',
      },
    };
    [{ db }, teardown] = await setUpDB({
      imports: [importObj],
    });
  });

  afterEach(async () => {
    await teardown();
  });

  it('returns id', () => {
    expect(Import.id(importObj, {}, { db }, gqlInfo)).toEqual('036ca3526c92bb2b555a3254');
  });

  it('returns filepath', () => {
    expect(Import.filepath(importObj, {}, { db }, gqlInfo)).toEqual(
      '/imports/my-new-audiobook.m4b',
    );
  });

  it('returns name', () => {
    expect(Import.name(importObj, {}, { db }, gqlInfo)).toEqual('How to Import Your Audiobooks');
  });

  it('returns lastModified', () => {
    expect(Import.lastModified(importObj, {}, { db }, gqlInfo)).toEqual(
      new Date(2020, 7, 29).getTime(),
    );
  });

  it('returns status', () => {
    expect(Import.status(importObj, {}, { db }, gqlInfo)).toEqual('pending');
  });

  it('returns error', () => {
    importObj.status = 'error';
    importObj.error = "couldn't do the thing";
    expect(Import.error(importObj, {}, { db }, gqlInfo)).toEqual("couldn't do the thing");
  });
});
