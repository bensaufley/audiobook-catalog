import { Db, ObjectID } from 'mongodb';

import Author from '~server/graphql/resolvers/Author';
import type { AuthorDbObject } from '~server/mongoTypes';
import { gqlInfo, setUpDB } from '~spec/support/spec-helpers';

describe('~server/graphql/resolvers/Author', () => {
  let author: AuthorDbObject;
  let db: Db;
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    author = {
      _id: new ObjectID('275e3ade142d417b9685ba16'),
      firstName: 'Charlie Jane',
      lastName: 'Anders',
    };
    [{ db }, teardown] = await setUpDB({
      authors: [author],
    });
  });

  afterEach(async () => {
    await teardown();
  });

  it('stringifies id', () => {
    expect(Author.id(author, {}, { db }, gqlInfo)).toEqual('275e3ade142d417b9685ba16');
  });

  it('returns firstName', () => {
    expect(Author.firstName(author, {}, { db }, gqlInfo)).toEqual('Charlie Jane');
  });

  it('returns lastName', () => {
    expect(Author.lastName(author, {}, { db }, gqlInfo)).toEqual('Anders');
  });
});
