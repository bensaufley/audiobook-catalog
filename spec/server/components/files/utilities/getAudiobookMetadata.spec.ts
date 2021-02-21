import getAudiobookMetadata from '~server/components/files/utilities/getAudiobookMetadata';

jest.mock('music-metadata');

describe('~server/components/files/utilities/getAudiobookMetadata', () => {
  it('parses a simple file', async () => {
    jest.mock('~server/components/files/utilities/getChecksum', () => {
      return async () => 'mocked-checksum';
    });
    jest.mock('fs');

    const md = await getAudiobookMetadata('/imports/simple-file.m4a');

    expect(md).toEqual({
      checksum: 'mocked-checksum',
    });
  });
});
