import { contrast } from 'chroma-js';

// eslint-disable-next-line import/prefer-default-export
export const chooseBestContrast = (base: string, ...colors: string[]): string =>
  colors.reduce((acc, color) => {
    if (contrast(base, color) > contrast(base, acc)) return color;
    return acc;
  });
