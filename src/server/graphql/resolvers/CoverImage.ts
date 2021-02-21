import type { IPicture } from 'music-metadata';

import type { Resolvers } from '~server/graphql/resolvers/types';

const CoverImage: Resolvers['CoverImage'] = {
  name: 'CoverImage',
  description: 'Buffer and metadata for an image',
  serialize: (value: IPicture | undefined) => {
    return value ? `data:${value.format};base64,${value.data.toString('base64')}` : undefined;
  },
  parseValue() {
    throw new Error('CoverImage is not accepted as an incoming scalar');
  },
  parseLiteral() {
    throw new Error('CoverImage is not accepted as an incoming scalar');
  },
} as any;

export default CoverImage;
