import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { ApolloServer } from 'apollo-server-koa';
import { DocumentNode } from 'graphql';
import { DateTypeDefinition } from 'graphql-scalars';
import Koa from 'koa';

import Audiobook from '~graphql/Audiobook.graphqls';
import AudiobookAuthor from '~graphql/AudiobookAuthor.graphqls';
import Author from '~graphql/Author.graphqls';
import Genre from '~graphql/Genre.graphqls';
import Import from '~graphql/Import.graphqls';
import Query from '~graphql/Query.graphqls';
import resolvers from '~server/graphql/resolvers';

const isDev = process.env.NODE_ENV === 'development';

const server = (app: Koa) => {
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs: [
      DIRECTIVES,
      (DateTypeDefinition as any) as DocumentNode,
      Audiobook,
      AudiobookAuthor,
      Author,
      Genre,
      Query,
      Import,
    ],
    playground: isDev,
    introspection: isDev,
  });

  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
  });

  return apolloServer;
};

export default server;
