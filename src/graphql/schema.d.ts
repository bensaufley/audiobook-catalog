// Generated file. Do not edit!

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
  CoverImage: any;
  Date: any;
};

export type Audiobook = {
  __typename?: 'Audiobook';
  id: Scalars['ID'];
  authors: Array<AudiobookAuthor>;
  cover: Maybe<Scalars['CoverImage']>;
  duration: Scalars['Float'];
  filepath: Scalars['String'];
  genres: Array<Genre>;
  name: Scalars['String'];
  year: Maybe<Scalars['Int']>;
};

export type AudiobookAuthor = {
  __typename?: 'AudiobookAuthor';
  id: Scalars['ID'];
  audiobook: Audiobook;
  author: Author;
  meta: Maybe<Scalars['String']>;
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID'];
  audiobooks: Array<AudiobookAuthor>;
  firstName: Maybe<Scalars['String']>;
  lastName: Scalars['String'];
};

export type Genre = {
  __typename?: 'Genre';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getAudiobooks: Array<Audiobook>;
  findAudiobooks: Array<Audiobook>;
  getToImports: Array<ToImport>;
};

export type QueryGetAudiobooksArgs = {
  start: Maybe<Scalars['ID']>;
};

export type QueryFindAudiobooksArgs = {
  str: Scalars['String'];
};

export type ToImport = {
  __typename?: 'ToImport';
  id: Scalars['ID'];
  filepath: Scalars['String'];
  name: Scalars['String'];
  lastModified: Scalars['Date'];
  conflict: Scalars['Boolean'];
};
