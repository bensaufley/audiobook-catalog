import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';

jest.mock('music-metadata');
jest.mock('~server/components/files/utilities/getChecksum', () => {
  return async () => 'mocked-checksum';
});
jest.mock('fs/promises');

describe('~server/components/files/utilities/getAudiobookMetadata', () => {
  let importsPath: string | undefined;
  beforeEach(() => {
    importsPath = process.env.IMPORTS_PATH;
    process.env.IMPORTS_PATH = '/imports/';
  });

  afterEach(() => {
    process.env.IMPORTS_PATH = importsPath;
  });

  it('processes data derived from real files', async () => {
    const md = await getAudiobookMetadata(
      '/imports/Ghost in the Wires-My Adventures as the World’s Most Wanted Hacker.m4a',
    );

    expect(md).toEqual({
      authors: [
        {
          firstName: 'Kevin',
          lastName: 'Mitnick',
          meta: undefined,
        },
        {
          firstName: 'William L.',
          lastName: 'Simon',
          meta: undefined,
        },
      ],
      checksum: 'mocked-checksum',
      cover: {
        data: expect.any(Buffer),
        format: 'image/jpeg',
      },
      duration: undefined,
      filename: 'ghost-in-the-wires-by-kevin-mitnick-william-l-simon.m4a',
      lastModified: '2021-02-12T20:19:07.422Z',
      name: 'Ghost in the Wires',
      year: 2011,
    });
  });
});
