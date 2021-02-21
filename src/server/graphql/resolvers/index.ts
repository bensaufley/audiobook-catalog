import { DateResolver as Date } from 'graphql-scalars';

import { ImportStatus } from '~graphql/schema';
import Audiobook from '~server/graphql/resolvers/Audiobook';
import AudiobookAuthor from '~server/graphql/resolvers/AudiobookAuthor';
import Author from '~server/graphql/resolvers/Author';
import CoverImage from '~server/graphql/resolvers/CoverImage';
import Genre from '~server/graphql/resolvers/Genre';
import Import from '~server/graphql/resolvers/Import';
import Query from '~server/graphql/resolvers/Query';
import type { Resolvers } from '~server/graphql/resolvers/types';

const resolvers: Resolvers = {
  Audiobook,
  AudiobookAuthor,
  Author,
  Date,
  Genre,
  CoverImage,
  Query,
  Import,
  ImportStatus: Object.values(ImportStatus).reduce((o, v) => ({ ...o, [v]: v }), {}),
};

export default resolvers;
