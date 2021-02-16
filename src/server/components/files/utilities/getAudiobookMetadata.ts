import { promises, Stats } from 'fs';
import { IPicture, parseFile } from 'music-metadata';

import getChecksum from '~server/components/files/utilities/getChecksum';

const processAuthors = (...vals: (string | string[] | undefined)[]): AuthorMetadata[] => {
  const artist = vals.reduce<string | undefined>(
    (v, val) => (v || Array.isArray(val) ? val![0] : val),
    undefined
  );
  if (!artist) return [{ firstName: undefined, lastName: 'Unknown', meta: undefined }];

  return artist.split(/( and |, (?!j(?:unio)r|s(enio)r))/gi).map((author) => {
    const parts = author.split(' ');
    const dashIndex = parts.findIndex((p) => /[-–—]/.test(p));
    let meta: string | undefined;
    if (dashIndex > 0) {
      meta = parts.splice(dashIndex).join(' ');
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
  lastModified: Date;
  year: number;
}

const getAudiobookMetadata = async <B extends boolean>(
  filename: string,
  {
    duration,
    stat,
  }: {
    duration?: B;
    stat?: Stats;
  } = {}
): Promise<AudiobookMetadata<B>> => {
  const st = stat || (await promises.stat(filename));
  const [{ common, format }, checksum] = await Promise.all([
    parseFile(filename, { duration: !!duration }),
    getChecksum(filename),
  ]);

  const name = common.album || common.title!;

  const authors = processAuthors(common.artists, common.artist, common.albumartist);

  return {
    checksum,
    name,
    authors,
    cover: common.picture?.pop(),
    duration: format.duration as B extends true ? number : undefined,
    lastModified: st.mtime,
    year: common.year!,
  };
};

export default getAudiobookMetadata;
