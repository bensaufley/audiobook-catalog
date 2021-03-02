import { Db } from 'mongodb';

import { Resolver, ResolverFn } from '~server/graphql/resolvers/types';

type ResolverFns<R> = {
  [k in keyof R]: R[k] extends Resolver<infer A, infer B, infer C, infer D>
    ? ResolverFn<A, B, C, D>
    : R[k];
};

export interface ApolloContext {
  db: Db;
}
