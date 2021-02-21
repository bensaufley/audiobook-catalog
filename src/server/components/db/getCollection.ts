import { Collection, MongoClient } from 'mongodb';

import getClient from '~server/components/db/getClient';
import type {
  AudiobookAuthorDbObject,
  AudiobookDbObject,
  AuthorDbObject,
  GenreDbObject,
  ImportDbObject,
} from '~server/mongoTypes';

type CollectionName = 'audiobooks' | 'audiobookAuthors' | 'authors' | 'genres' | 'toImport';
type CN = CollectionName;
type _CN = CollectionName | undefined;

type CollectionType<T> = T extends 'audiobooks'
  ? AudiobookDbObject
  : T extends 'audiobookAuthors'
  ? AudiobookAuthorDbObject
  : T extends 'authors'
  ? AuthorDbObject
  : T extends 'genres'
  ? GenreDbObject
  : T extends 'toImport'
  ? ImportDbObject
  : never;

const getCollection = async <T extends CollectionName>(
  collection: T,
): Promise<readonly [MongoClient, Collection<CollectionType<T>>]> => {
  const client = await getClient();
  const db = client.db();
  return [client, db.collection<CollectionType<T>>(collection)] as const;
};

export default getCollection;

export const getCollections = async <
  A extends CN,
  B extends _CN,
  C extends _CN,
  D extends _CN,
  E extends _CN,
  F extends _CN
>(
  ...collections: [A] | [A, B] | [A, B, C] | [A, B, C, D] | [A, B, C, D, E] | [A, B, C, D, E, F]
) => {
  const client = await getClient();
  const db = client.db();

  return [
    client,
    ...(collections as CN[]).map((collection: CN) =>
      collection ? db.collection(collection as CN) : undefined,
    ),
  ] as [
    MongoClient,
    Collection<CollectionType<A>>,
    B extends undefined ? undefined : Collection<CollectionType<B>>,
    C extends undefined ? undefined : Collection<CollectionType<C>>,
    D extends undefined ? undefined : Collection<CollectionType<D>>,
    E extends undefined ? undefined : Collection<CollectionType<E>>,
    F extends undefined ? undefined : Collection<CollectionType<F>>,
  ];
};
