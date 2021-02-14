import * as Urql from '@urql/preact';
import gql from 'graphql-tag';

import type * as SchemaTypes from '~graphql/schema';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAudiobooksQueryVariables = SchemaTypes.Exact<{
  startId: SchemaTypes.Maybe<SchemaTypes.Scalars['ID']>;
}>;

export type GetAudiobooksQuery = {
  __typename?: 'Query';
  getAudiobooks: Array<{
    __typename?: 'Audiobook';
    id: string;
    name: string;
    authors: Array<{ __typename?: 'Author'; id: string; lastName: string; firstName: string }>;
  }>;
};

export const GetAudiobooksDocument = gql`
  query getAudiobooks($startId: ID) {
    getAudiobooks(start: $startId) {
      id
      name
      authors {
        id
        lastName
        firstName
      }
    }
  }
`;

export function useGetAudiobooksQuery(
  options: Omit<Urql.UseQueryArgs<GetAudiobooksQueryVariables>, 'query'> = {}
) {
  return Urql.useQuery<GetAudiobooksQuery>({ query: GetAudiobooksDocument, ...options });
}
