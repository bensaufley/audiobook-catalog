import mergeDeep from 'merge-deep';
import type { IAudioMetadata, IOptions } from 'music-metadata';

export const parse = async (
  filename: string,
  { duration }: IOptions = {}
): Promise<IAudioMetadata> => {
  const emptyMetadata: IAudioMetadata = {
    common: {
      track: { no: 1, of: 1 },
      disk: { no: null, of: null },
      movementIndex: {},
    },
    native: {},
    format: {
      trackInfo: [],
    },
    quality: {
      warnings: [],
    },
  };

  switch (filename) {
    case '/imports/empty-metadata.m4a':
      return emptyMetadata;
    case '/imports/simple-file.m4a':
      return mergeDeep(emptyMetadata, {
        common: {
          title: 'Simple Title',
          artists: ['Single Author'],
          artist: 'Single Author',
          albumartist: 'Single Author',
          album: 'Simple Title',
          year: 2018,
        },
        format: duration
          ? {
              duration: 31_380,
            }
          : {},
      });
    default:
      throw new Error('unexpected filename');
  }
};
