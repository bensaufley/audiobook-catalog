import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';

import Audiobook from '~graphql/Audiobook.graphqls';
import Author from '~graphql/Author.graphqls';
import Query from '~graphql/Query.graphqls';
import resolvers from '~server/graphql/resolvers';

const isDev = process.env.NODE_ENV === 'development';

const server = (app: Koa) => {
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs: [DIRECTIVES, Audiobook, Author, Query],
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
