import { Db, ObjectID } from 'mongodb';

import AudiobookAuthor from '~server/graphql/resolvers/AudiobookAuthor';
import type {
  AudiobookAuthorDbObject,
  AudiobookDbObject,
  AuthorDbObject,
} from '~server/mongoTypes';
import { gqlInfo, setUpDB } from '~spec/support/spec-helpers';

describe('~server/graphql/resolvers/AudiobookAuthor', () => {
  let audiobook: AudiobookDbObject;
  let audiobookAuthor: AudiobookAuthorDbObject;
  let author: AuthorDbObject;
  let db: Db;
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    audiobook = {
      _id: new ObjectID('6c34232c4b4c5b8fe8bcc1d7'),
      name: 'A Memory Called Empire',
      cover: null,
      duration: 56160,
      filename: 'a-memory-called-empire-by-arkady-martine.m4b',
      genres: [],
      meta: {
        checksum: '',
      },
      year: 2019,
    };
    audiobookAuthor = {
      _id: new ObjectID('fffc279b496ae9bff0ab4370'),
      audiobook: new ObjectID('6c34232c4b4c5b8fe8bcc1d7'),
      author: new ObjectID('675b988fea1b4e3b948c4c6c'),
      meta: 'translator',
    };
    author = {
      _id: new ObjectID('675b988fea1b4e3b948c4c6c'),
      firstName: 'Arkady',
      lastName: 'Martine',
    };

    [{ db }, teardown] = await setUpDB({
      audiobooks: [audiobook],
      audiobookAuthors: [audiobookAuthor],
      authors: [author],
    });
  });

  afterEach(async () => {
    await teardown();
  });

  it('retrieves the audiobook', async () => {
    expect(await AudiobookAuthor.audiobook(audiobookAuthor, {}, { db }, gqlInfo)).toEqual(
      audiobook,
    );
  });

  it('retrieves the author', async () => {
    expect(await AudiobookAuthor.author(audiobookAuthor, {}, { db }, gqlInfo)).toEqual(author);
  });

  it('retrieves the metadata', async () => {
    expect(await AudiobookAuthor.meta(audiobookAuthor, {}, { db }, gqlInfo)).toEqual('translator');
  });
});
