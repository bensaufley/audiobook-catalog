import type { AudiobookJSON } from '~db/models/Audiobook';
import type { TagJSON } from '~db/models/Tag';
import type { UpNextJSON } from '~db/models/UpNext';
import type User from '~db/models/User';

import createFetch, { Needs } from './createFetch';

export const getBooks = createFetch<{ audiobooks: AudiobookJSON[] }>('GET', '/api/books');

export const getTags = createFetch<{ tags: TagJSON[] }>('GET', '/api/tags');

export const getRead = createFetch<{ bookIds: string[] }>('GET', '/api/books/read');

export const createTag = createFetch<{ color: string; name: string; bookId?: string | undefined }, { tag: TagJSON }>(
  'POST',
  '/api/tags',
  Needs.Body,
);

export const deleteTag = createFetch<{ name: string }>('DELETE', '/api/tags', Needs.Body);

export const tagBook = createFetch<{ name: string }, string>(
  'POST',
  (bookId) => `/api/books/${bookId}/tag`,
  Needs.Query,
);

export const untagBook = createFetch<{ name: string }, string>(
  'DELETE',
  (bookId) => `/api/books/${bookId}/tag`,
  Needs.Query,
);

export const getUpNext = createFetch<{ upNexts: Pick<UpNextJSON, 'AudiobookId' | 'order'>[] }>(
  'GET',
  '/api/books/up-next',
);

export const reorderBooks = createFetch<
  { bookIds: string[] },
  { upNexts: Pick<UpNextJSON, 'AudiobookId' | 'order'>[] }
>('POST', '/api/books/up-next', Needs.Body);

export const createUser = createFetch<{ username: string }, string>('POST', '/api/users', Needs.Body);

export const readBook = createFetch<string>('POST', (id) => `/api/books/${id}/read`);

export const unreadBook = createFetch<string>('POST', (id) => `/api/books/${id}/unread`);

export const addBookToUpNext = createFetch<string>('POST', (id) => `/api/books/${id}/up-next`);

export const removeBookFromUpNext = createFetch<string>('DELETE', (id) => `/api/books/${id}/up-next`);

export const getUsers = createFetch<User[]>('GET', '/api/users');
