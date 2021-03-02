import { Binary, Db, ObjectID } from 'mongodb';

import Audiobook from '~server/graphql/resolvers/Audiobook';
import type { AudiobookDbObject, GenreDbObject } from '~server/mongoTypes';
import { gqlInfo, setUpDB } from '~spec/support/spec-helpers';

describe('~server/graphql/resolvers/Audiobook', () => {
  let audiobook: AudiobookDbObject;
  let cover: Binary;
  let db: Db;
  let genres: GenreDbObject[];
  let teardown: () => Promise<void>;

  beforeEach(async () => {
    cover = new Binary(
      /* eslint-disable-next-line */
      Buffer.from([ 255, 216, 255, 219, 0, 132, 0, 8, 5, 5, 5, 6, 5, 8, 6, 6, 8, 11, 7, 6, 7, 11, 13, 10, 8, 8, 10, 13, 15, 12, 12, 13, 12, 12, 15, 17, 12, 13, 13, 13, 13, 12, 17, 15, 17, 18, 19, 18, 17, 15, 23, 23, 25, 25, 23, 23, 34, 33, 33, 33, 34, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 1, 8, 9, 9, 16, 14, 16, 29, 20, 20, 29, 32, 26, 21, 26, 32, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 255, 221, 0, 4, 0, 2, 255, 238, 0, 14, 65, 100, 111, 98, 101, 0, 100, 192, 0, 0, 0, 1, 255, 192, 0, 17, 8, 0, 16, 0, 16, 3, 0, 17, 0, 1, 17, 1, 2, 17, 1, 255, 196, 0, 103, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 7, 1, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 2, 3, 16, 0, 2, 2, 1, 3, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 17, 0, 5, 33, 6, 7, 18, 19, 22, 49, 50, 65, 17, 0, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 3, 18, 49, 97, 17, 255, 218, 0, 12, 3, 0, 0, 1, 17, 2, 17, 0, 63, 0, 214, 58, 219, 122, 191, 65, 170, 71, 183, 182, 102, 70, 54, 44, 68, 161, 137, 245, 70, 70, 12, 158, 63, 81, 147, 144, 121, 214, 54, 177, 26, 140, 82, 128, 251, 236, 103, 165, 186, 150, 125, 221, 100, 142, 228, 34, 181, 165, 85, 150, 52, 30, 67, 217, 19, 113, 236, 80, 223, 204, 241, 157, 26, 223, 45, 202, 219, 94, 58, 159, 255, 208, 168, 238, 95, 201, 170, 238, 247, 167, 90, 102, 245, 41, 227, 133, 169, 229, 73, 69, 104, 0, 120, 240, 203, 249, 101, 151, 39, 157, 42, 229, 131, 112, 199, 43, 196, 175, 68, 59, 105, 242, 107, 91, 189, 25, 154, 153, 163, 74, 8, 230, 107, 152, 82, 16, 180, 224, 188, 153, 102, 253, 51, 75, 131, 198, 130, 22, 45, 193, 37, 152, 133, 233, 159, 255, 217])
    );
    genres = [
      { _id: new ObjectID('c03a001c91422a0fc09651b0'), name: 'fiction' },
      { _id: new ObjectID('c6bd8e67b621d48586fde4fb'), name: 'fantasy' },
    ];
    audiobook = {
      _id: new ObjectID('777845639c8c3a6fd80b53b2'),
      cover: {
        type: 'image/jpeg',
        data: cover,
      },
      duration: 30736,
      filename: 'sample-file.m4b',
      meta: { checksum: '' },
      name: 'Sample Audiobook',
      genres: [new ObjectID('c03a001c91422a0fc09651b0'), new ObjectID('c6bd8e67b621d48586fde4fb')],
      year: 2021,
    };
    [{ db }, teardown] = await setUpDB({
      genres,
      audiobookAuthors: [
        {
          _id: new ObjectID('21b8c924cc8e34cee7dce119'),
          audiobook: new ObjectID('777845639c8c3a6fd80b53b2'),
          author: new ObjectID('21282a97703a49e04fd40e77'),
          meta: null,
        },
      ],
    });
  });

  afterEach(async () => {
    await teardown();
  });

  it('stringifies id', () => {
    expect(Audiobook.id(audiobook, {}, { db }, gqlInfo)).toEqual('777845639c8c3a6fd80b53b2');
  });

  it('returns audiobookAuthors for authors', async () => {
    expect(await Audiobook.authors(audiobook, {}, { db }, gqlInfo)).toEqual([
      {
        _id: new ObjectID('21b8c924cc8e34cee7dce119'),
        audiobook: new ObjectID('777845639c8c3a6fd80b53b2'),
        author: new ObjectID('21282a97703a49e04fd40e77'),
        meta: null,
      },
    ]);
  });

  it('returns the raw cover', () => {
    expect(Audiobook.cover(audiobook, {}, { db }, gqlInfo)).toEqual({
      type: 'image/jpeg',
      data: cover,
    });
  });

  it('retrieves duration', () => {
    expect(Audiobook.duration(audiobook, {}, { db }, gqlInfo)).toEqual(30736);
  });

  it('retrieves filename', () => {
    expect(Audiobook.filename(audiobook, {}, { db }, gqlInfo)).toEqual('sample-file.m4b');
  });

  it('retrieves genres', async () => {
    const g = await Audiobook.genres(audiobook, {}, { db }, gqlInfo);
    expect(g).toContainEqual(genres[0]);
    expect(g).toContainEqual(genres[1]);
  });

  it('retrieves name', () => {
    expect(Audiobook.name(audiobook, {}, { db }, gqlInfo)).toEqual('Sample Audiobook');
  });

  it('retrieves year', () => {
    expect(Audiobook.year(audiobook, {}, { db }, gqlInfo)).toEqual(2021);
  });
});
