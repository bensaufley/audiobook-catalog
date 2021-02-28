import { Collection, Db } from 'mongodb';

import type {
  AudiobookAuthorDbObject,
  AudiobookDbObject,
  AuthorDbObject,
  GenreDbObject,
  ImportDbObject,
} from '~server/mongoTypes';

type CollectionName = 'audiobooks' | 'audiobookAuthors' | 'authors' | 'genres' | 'imports';
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
  : T extends 'imports'
  ? ImportDbObject
  : never;

const getCollection = async <T extends CollectionName>(
  db: Db,
  collection: T,
): Promise<Collection<CollectionType<T>>> => db.collection<CollectionType<T>>(collection);

export default getCollection;

export const getCollections = async <
  A extends CN,
  B extends _CN,
  C extends _CN,
  D extends _CN,
  E extends _CN,
  F extends _CN
>(
  db: Db,
  ...collections: [A, B?, C?, D?, E?, F?]
) =>
  [
    ...(collections as CN[]).map((collection: CN) =>
      collection ? db.collection(collection as CN) : undefined,
    ),
  ] as [
    Collection<CollectionType<A>>,
    B extends undefined ? undefined : Collection<CollectionType<B>>,
    C extends undefined ? undefined : Collection<CollectionType<C>>,
    D extends undefined ? undefined : Collection<CollectionType<D>>,
    E extends undefined ? undefined : Collection<CollectionType<E>>,
    F extends undefined ? undefined : Collection<CollectionType<F>>,
  ];
