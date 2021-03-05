import { Db, ObjectID } from 'mongodb';

import Genre from '~server/graphql/resolvers/Genre';
import type { GenreDbObject } from '~server/mongoTypes';
import { gqlInfo, setUpDB } from '~spec/support/spec-helpers';

describe('~server/graphql/resolvers/Genre', () => {
  let genre: GenreDbObject;
  let db: Db;
  let teardown: () => void;

  beforeEach(async () => {
    genre = {
      _id: new ObjectID('1f496391e5368b0c6388c3fc'),
      name: 'fantasy',
    };
    [{ db }, teardown] = await setUpDB({
      genres: [genre],
    });
  });

  afterEach(async () => {
    await teardown();
  });

  it('serializes id', () => {
    expect(Genre.id(genre, {}, { db }, gqlInfo)).toEqual('1f496391e5368b0c6388c3fc');
  });

  it('returns name', () => {
    expect(Genre.name(genre, {}, { db }, gqlInfo)).toEqual('fantasy');
  });
});
