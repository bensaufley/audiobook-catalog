import type { PathLike, Stats } from 'fs';
import { readFileSync } from 'fs';
import type fsType from 'fs/promises';
import { basename, extname } from 'path';

const fs = jest.createMockFromModule<typeof fsType>('fs/promises');

export default fs;

export const stat: typeof fsType.stat = async (filepath: PathLike): Promise<Stats> => {
  const name = basename(filepath.toString(), extname(filepath.toString()));
  return JSON.parse(
    readFileSync(require.resolve(`~spec/__mocks__/data/[stat] ${name}.json`)).toString(),
  );
};

export const rm: typeof fsType.rm = jest.fn().mockResolvedValue(undefined);

export const rmdir: typeof fsType.rmdir = jest.fn().mockResolvedValue(undefined);
