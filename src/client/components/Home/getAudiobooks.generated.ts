// Generated file. Do not edit!

import * as Urql from '@urql/preact';
import gql from 'graphql-tag';

import type * as SchemaTypes from '~graphql/schema.generated';

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type GetAudiobooksQueryVariables = SchemaTypes.Exact<{
  startId: SchemaTypes.Maybe<SchemaTypes.Scalars['ID']>;
}>;

export type GetAudiobooksQuery = {
  __typename?: 'Query';
  getAudiobooks: Array<{ __typename?: 'Audiobook' } & AudiobookFragment>;
};

export type AudiobookFragment = {
  __typename?: 'Audiobook';
  id: string;
  duration: number;
  filename: string;
  name: string;
  year: SchemaTypes.Maybe<number>;
  genres: Array<{ __typename?: 'Genre'; name: string }>;
  authors: Array<{
    __typename?: 'AudiobookAuthor';
    id: string;
    meta: SchemaTypes.Maybe<string>;
    author: { __typename?: 'Author'; lastName: string; firstName: SchemaTypes.Maybe<string> };
  }>;
};

export const AudiobookFragmentDoc = gql`
  fragment audiobook on Audiobook {
    id
    duration
    filename
    name
    year
    genres {
      name
    }
    authors {
      id
      author {
        lastName
        firstName
      }
      meta
    }
  }
`;
export const GetAudiobooksDocument = gql`
  query getAudiobooks($startId: ID) {
    getAudiobooks(start: $startId) {
      ...audiobook
    }
  }
  ${AudiobookFragmentDoc}
`;

export function useGetAudiobooksQuery(
  options: Omit<Urql.UseQueryArgs<GetAudiobooksQueryVariables>, 'query'> = {},
) {
  return Urql.useQuery<GetAudiobooksQuery>({ query: GetAudiobooksDocument, ...options });
}
