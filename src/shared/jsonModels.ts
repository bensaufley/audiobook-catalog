export type JSONModel<
  Attributes extends Record<string, unknown>,
  Associations extends Record<string, unknown> = Record<string, never>,
> = Attributes & {
  createdAt: Date;
  updatedAt: Date;
} & Partial<Associations>;

export type UserAudiobookJSON = JSONModel<
  {
    read: boolean;
    AudiobookId: string;
    UserId: string;
  },
  {
    Audiobook: AudiobookJSON;
    User: UserJSON;
  }
>;

export type UserJSON = JSONModel<
  {
    id: string;
    username: string;
  },
  {
    Audiobooks: AudiobookJSON[];
    UserAudiobooks: UserAudiobookJSON[];
  }
>;

export type NarratorJSON = JSONModel<
  {
    id: string;
    firstName: string | null;
    lastName: string;
  },
  {
    Audiobooks: AudiobookJSON[];
  }
>;

export type AuthorJSON = JSONModel<
  {
    id: string;
    firstName: string | null;
    lastName: string;
  },
  {
    Audiobooks: AudiobookJSON[];
  }
>;

export type AudiobookJSON = JSONModel<
  {
    id: string;
    title: string;
    filepath: string;
    cover: Buffer | null;
    coverType: string | null;
    duration: number | null;
  },
  {
    AudiobookAuthors: AudiobookAuthorJSON[];
    AudiobookNarrators: AudiobookNarratorJSON[];
    UserAudiobooks: UserAudiobookJSON[];
    Authors: AuthorJSON[];
    Narrators: NarratorJSON[];
    Users: UserJSON[];
  }
>;

export type AudiobookAuthorJSON = JSONModel<
  {
    AudiobookId: string;
    AuthorId: string;
  },
  {
    Audiobook: AudiobookJSON;
    Author: AuthorJSON;
  }
>;

export type AudiobookNarratorJSON = JSONModel<
  {
    AudiobookId: string;
    NarratorId: string;
  },
  {
    Audiobook: AudiobookJSON;
    Narrator: NarratorJSON;
  }
>;

export type RawJSON<T extends JSONModel<any, any>> = {
  [k in keyof T]: T[k] extends Date ? string : T[k] extends Buffer ? string : T[k];
};
