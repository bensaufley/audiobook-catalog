import { render } from '@testing-library/preact';
import { Client, PromisifiedSource, Provider } from '@urql/preact';
import type { GraphQLResolveInfo } from 'graphql';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { h, VNode } from 'preact';
import { never, Source, take, toPromise } from 'wonka';

import type {
  AudiobookAuthorDbObject,
  AudiobookDbObject,
  AuthorDbObject,
  GenreDbObject,
  ImportDbObject,
} from '~server/mongoTypes';

export const mockClient = (c: Partial<Client> = {}) =>
  ({
    executeQuery: jest.fn(() => never),
    executeMutation: jest.fn(() => never),
    executeSubscription: jest.fn(() => never),
    ...c,
  } as Client);

// this is what urql does internally. Used for stubbing.
export const withPromise = <T extends any>(s: Source<T>): PromisifiedSource<T> => {
  (s as PromisifiedSource<T>).toPromise = () => toPromise<T>(take<T>(1)(s)); // eslint-disable-line no-param-reassign
  return s as PromisifiedSource<T>;
};

export const renderWithProviders = ({ client = mockClient() }: { client?: Client } = {}) => (
  children: VNode,
) => render(<Provider value={client}>{children}</Provider>);

export interface WholeDB {
  audiobooks: AudiobookDbObject[];
  audiobookAuthors: AudiobookAuthorDbObject[];
  authors: AuthorDbObject[];
  genres: GenreDbObject[];
  imports: ImportDbObject[];
}

const entries = Object.entries as <O>(o: O) => [keyof O, O[keyof O]][];

export const setUpDB = async (initial?: Partial<WholeDB>) => {
  const mongo = new MongoMemoryServer();

  const client = new MongoClient(await mongo.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db();
  if (initial) {
    await Promise.all(
      entries(initial).map(async ([collection, data]) => {
        if (!data) return;

        await db.collection(collection).insertMany(data, { bypassDocumentValidation: true });
      }),
    );
  }
  return [
    { client, db, mongo },
    async () => {
      await client.close();
      await mongo.stop();
    },
  ] as const;
};

export const gqlInfo: GraphQLResolveInfo = {} as any;
