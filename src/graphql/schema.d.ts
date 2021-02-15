// Generated file. Do not edit!

import { ObjectID } from 'mongodb';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Audiobook = {
  __typename?: 'Audiobook';
  id: Scalars['ID'];
  name: Scalars['String'];
  authors: Array<Author>;
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID'];
  audiobooks: Array<Audiobook>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAudiobooks: Array<Audiobook>;
  findAudiobooks: Array<Audiobook>;
};

export type QueryGetAudiobooksArgs = {
  start: Maybe<Scalars['ID']>;
};

export type QueryFindAudiobooksArgs = {
  str: Scalars['String'];
};

export type AdditionalEntityFields = {
  path: Maybe<Scalars['String']>;
  type: Maybe<Scalars['String']>;
};
export type AudiobookDbObject = {
  _id: ObjectID;
  name: string;
  authors: Array<AuthorDbObject['_id']>;
  meta: {
    checksum: string;
  };
};

export type AuthorDbObject = {
  _id: ObjectID;
  audiobooks: Array<AudiobookDbObject['_id']>;
  firstName: string;
  lastName: string;
};
