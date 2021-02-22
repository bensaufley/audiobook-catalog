import { existsSync, readFileSync } from 'fs';
import type MusicMetadata from 'music-metadata';
import { basename, extname } from 'path';

jest.createMockFromModule<typeof MusicMetadata>('music-metadata');

export const parseFile = async (
  filename: string,
  { duration }: MusicMetadata.IOptions = {},
): Promise<MusicMetadata.IAudioMetadata> => {
  const emptyMetadata: MusicMetadata.IAudioMetadata = {
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

  const name = basename(filename, extname(filename));

  if (existsSync(require.resolve(`~spec/__mocks__/data/[metadata] ${name}.json`))) {
    const md: MusicMetadata.IAudioMetadata = JSON.parse(
      readFileSync(require.resolve(`~spec/__mocks__/data/[metadata] ${name}.json`)).toString(),
    );
    return {
      ...md,
      common: {
        ...md.common,
        picture: md.common.picture
          ? md.common.picture.map((picture) => ({ ...picture, data: Buffer.from(picture.data) }))
          : undefined,
      },
      format: { ...md.format, duration: duration ? md.format.duration : undefined },
    };
  }
  return emptyMetadata;
};
