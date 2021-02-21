import { DateResolver as Date } from 'graphql-scalars';

import Audiobook from '~server/graphql/resolvers/Audiobook';
import AudiobookAuthor from '~server/graphql/resolvers/AudiobookAuthor';
import Author from '~server/graphql/resolvers/Author';
import CoverImage from '~server/graphql/resolvers/CoverImage';
import Genre from '~server/graphql/resolvers/Genre';
import Query from '~server/graphql/resolvers/Query';
import ToImport from '~server/graphql/resolvers/ToImport';
import type { Resolvers } from '~server/graphql/resolvers/types';

const resolvers: Resolvers = {
  Audiobook,
  AudiobookAuthor,
  Author,
  Date,
  Genre,
  CoverImage,
  Query,
  ToImport,
};

export default resolvers;
