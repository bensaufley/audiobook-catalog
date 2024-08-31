import createFetch, { Needs } from './createFetch';

export const reorderBooks = createFetch<{ bookIds: string[] }>('POST', '/api/users/books/up-next', Needs.Body);

export const createUser = createFetch<{ username: string }, string>('POST', '/api/users', Needs.Body);
