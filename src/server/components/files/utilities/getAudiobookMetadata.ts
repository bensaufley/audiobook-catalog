import type { Stats } from 'fs';
import { stat } from 'fs/promises';
import { IPicture, parseFile } from 'music-metadata';
import { extname } from 'path';

import getChecksum from '~server/components/files/utilities/getChecksum';

const processAuthors = (...vals: (string | string[] | undefined)[]): AuthorMetadata[] => {
  const artist = vals.reduce<string | undefined>(
    (v, val) => v || (Array.isArray(val) ? val![0] : val),
    undefined,
  );
  if (!artist) return [{ firstName: undefined, lastName: 'Unknown', meta: undefined }];

  return artist.split(/(?: and |, (?!j(?:unio)r|s(?:enio)r))/gi).map((author) => {
    const parts = author.split(' ');
    const dashIndex = parts.findIndex((p) => /[-–—]/.test(p));
    let meta: string | undefined;
    if (dashIndex > 0) {
      meta = parts.splice(dashIndex).splice(1).join(' ');
    }
    return {
      meta,
      lastName: parts.pop()!,
      firstName: parts.join(' ') || undefined,
    };
  });
};

export interface AuthorMetadata {
  firstName: string | undefined;
  lastName: string;
  meta: string | undefined;
}

export interface AudiobookMetadata<B extends boolean> {
  checksum: string;
  name: string;
  authors: AuthorMetadata[];
  cover?: IPicture;
  duration: B extends true ? number : undefined;
  filename: string;
  lastModified: Date;
  year: number;
}

const getAudiobookMetadata = async <B extends boolean>(
  filepath: string,
  {
    duration,
    stat: cachedStat,
  }: {
    duration?: B;
    stat?: Stats;
  } = {},
): Promise<AudiobookMetadata<B>> => {
  const st = cachedStat || (await stat(filepath));
  const [{ common, format }, checksum] = await Promise.all([
    parseFile(filepath, { duration: !!duration }),
    getChecksum(filepath),
  ]);
  if (Number.isNaN(format.duration)) {
    // Addresses bug (?) where duration is NaN. It's a hack.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    format.duration = undefined;
  }

  const name = common.album || common.title!;

  const authors = processAuthors(common.artists, common.artist, common.albumartist);
  const filename =
    `${name} by ${authors
      .map(({ firstName, lastName }) => [firstName, lastName].filter(Boolean).join(' '))
      .join(', ')}`
      .toLocaleLowerCase()
      .replace(/[^a-z0-9]+/gi, '-') + extname(filepath);

  return {
    checksum,
    filename,
    name,
    authors,
    cover: common.picture?.pop(),
    duration: format.duration as B extends true ? number : undefined,
    lastModified: st.mtime,
    year: common.year!,
  };
};

export default getAudiobookMetadata;
