// Generated file. Do not edit!

import * as Urql from '@urql/preact';
import gql from 'graphql-tag';

import type * as SchemaTypes from '~graphql/schema';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetUserQueryVariables = SchemaTypes.Exact<{
  id: SchemaTypes.Scalars['ID'];
}>;

export type GetUserQuery = {
  __typename?: 'Query';
  getUser: SchemaTypes.Maybe<{ __typename?: 'User'; username: string }>;
};

export const GetUserDocument = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      username
    }
  }
`;

export function useGetUserQuery(
  options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
}
