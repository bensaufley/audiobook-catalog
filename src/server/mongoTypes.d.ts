// Generated file. Do not edit!

import { ObjectID } from 'mongodb';
import type { IPicture } from 'music-metadata';

export type AudiobookDbObject = {
  _id: ObjectID;
  cover: Maybe<IPicture>;
  duration: number;
  filepath: string;
  genres: Array<GenreDbObject['_id']>;
  name: string;
  year: Maybe<number>;
  meta: {
    checksum: string;
  };
};

export type AudiobookAuthorDbObject = {
  _id: ObjectID;
  audiobook: AudiobookDbObject['_id'];
  author: AuthorDbObject['_id'];
  meta: Maybe<string>;
};

export type AuthorDbObject = {
  _id: ObjectID;
  firstName: Maybe<string>;
  lastName: string;
};

export type GenreDbObject = {
  _id: ObjectID;
  name: string;
};

export type ToImportDbObject = {
  _id: ObjectID;
  filepath: string;
  name: string;
  lastModified: Date;
  conflict: boolean;
  meta: {
    checksum: string;
  };
};
