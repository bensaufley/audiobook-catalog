import { IPicture } from 'music-metadata';

import CoverImage from '~server/graphql/resolvers/CoverImage';

describe('~server/graphql/resolvers/CoverImage', () => {
  it('serializes', () => {
    const value: IPicture = {
      format: 'image/jpeg',
      // eslint-disable-next-line prettier/prettier
      data: Buffer.from([255, 216, 255, 219, 0, 132, 0, 8, 5, 5, 5, 6, 5, 8, 6, 6, 8, 11, 7, 6, 7, 11, 13, 10, 8, 8, 10, 13, 15, 12, 12, 13, 12, 12, 15, 17, 12, 13, 13, 13, 13, 12, 17, 15, 17, 18, 19, 18, 17, 15, 23, 23, 25, 25, 23, 23, 34, 33, 33, 33, 34, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 1, 8, 9, 9, 16, 14, 16, 29, 20, 20, 29, 32, 26, 21, 26, 32, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 255, 221, 0, 4, 0, 2, 255, 238, 0, 14, 65, 100, 111, 98, 101, 0, 100, 192, 0, 0, 0, 1, 255, 192, 0, 17, 8, 0, 16, 0, 16, 3, 0, 17, 0, 1, 17, 1, 2, 17, 1, 255, 196, 0, 103, 0, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 6, 7, 1, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 2, 3, 16, 0, 2, 2, 1, 3, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 17, 0, 5, 33, 6, 7, 18, 19, 22, 49, 50, 65, 17, 0, 2, 2, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 3, 18, 49, 97, 17, 255, 218, 0, 12, 3, 0, 0, 1, 17, 2, 17, 0, 63, 0, 214, 58, 219, 122, 191, 65, 170, 71, 183, 182, 102, 70, 54, 44, 68, 161, 137, 245, 70, 70, 12, 158, 63, 81, 147, 144, 121, 214, 54, 177, 26, 140, 82, 128, 251, 236, 103, 165, 186, 150, 125, 221, 100, 142, 228, 34, 181, 165, 85, 150, 52, 30, 67, 217, 19, 113, 236, 80, 223, 204, 241, 157, 26, 223, 45, 202, 219, 94, 58, 159, 255, 208, 168, 238, 95, 201, 170, 238, 247, 167, 90, 102, 245, 41, 227, 133, 169, 229, 73, 69, 104, 0, 120, 240, 203, 249, 101, 151, 39, 157, 42, 229, 131, 112, 199, 43, 196, 175, 68, 59, 105, 242, 107, 91, 189, 25, 154, 153, 163, 74, 8, 230, 107, 152, 82, 16, 180, 224, 188, 153, 102, 253, 51, 75, 131, 198, 130, 22, 45, 193, 37, 152, 133, 233, 159, 255, 217]),
    };
    expect(CoverImage.serialize(value)).toEqual(
      `data:image/jpeg;base64,/9j/2wCEAAgFBQUGBQgGBggLBwYHCw0KCAgKDQ8MDA0MDA8RDA0NDQ0MEQ8REhMSEQ8XFxkZFxciISEhIiYmJiYmJiYmJiYBCAkJEA4QHRQUHSAaFRogJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJiYmJv/dAAQAAv/uAA5BZG9iZQBkwAAAAAH/wAARCAAQABADABEAAREBAhEB/8QAZwAAAwEAAAAAAAAAAAAAAAAAAAQGBwEAAgMAAAAAAAAAAAAAAAAAAQQAAgMQAAICAQMEAwEAAAAAAAAAAAECAwQRAAUhBgcSExYxMkERAAICAwEAAAAAAAAAAAAAAAECAAMSMWER/9oADAMAAAERAhEAPwDWOtt6v0GqR7e2ZkY2LEShifVGRgyeP1GTkHnWNrEajFKA++xnpbqWfd1kjuQitaVVljQeQ9kTcexQ38zxnRrfLcrbXjqf/9Co7l/Jqu73p1pm9SnjhanlSUVoAHjwy/lllyedKuWDcMcrxK9EO2nya1u9GZqZo0oI5muYUhC04LyZZv0zS4PGghYtwSWYhemf/9k=`,
    );
  });

  it('returns undefined for no value', () => {
    expect(CoverImage.serialize(undefined)).toBe(undefined);
  });

  it('throws for parseValue', () => {
    expect(() => CoverImage.parseValue('foo')).toThrow(
      'CoverImage is not accepted as an incoming scalar',
    );
  });

  it('throws for parseLiteral', () => {
    expect(() =>
      CoverImage.parseLiteral({ kind: 'Variable', name: { kind: 'Name', value: 'cover' } }, null),
    ).toThrow('CoverImage is not accepted as an incoming scalar');
  });
});
