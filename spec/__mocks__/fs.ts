import type fsType from 'fs';
import { basename, dirname } from 'path';

const fs = jest.createMockFromModule<typeof fsType>('fs');

export default fs;

let mockFiles = Object.create(null);
export const __setMockFiles = (newMockFiles: string[]) => {
  mockFiles = Object.create(null);
  newMockFiles.forEach((file) => {
    const dir = dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(basename(file));
  });
};

export const stat = (directoryPath: string): fsType.Stats => {
  return mockFiles[directoryPath] || [];
};
