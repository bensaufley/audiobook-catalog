import { addBookToUpNext, readBook, removeBookFromUpNext, reorderBooks, unreadBook } from '~client/fetches';
import type { AudiobookJSON } from '~db/models/Audiobook';

import { currentUserId } from '../user';

import { rawBooks, readBooks, upNext } from '.';

export const updateBook = (book: Partial<AudiobookJSON>) => {
  rawBooks.value = rawBooks.peek()?.map((b) => (b.id === book.id ? { ...b, ...book } : b));
};

export const setBookRead = async (id: string, read: boolean) => {
  if (!currentUserId.peek()) return false;

  try {
    const resp = await (read ? readBook(id) : unreadBook(id));

    if (resp.result === 'error') return false;

    if (read) {
      readBooks.value = (readBooks.peek() ?? []).concat(id);
    } else {
      readBooks.value = readBooks.peek()?.filter((i) => i !== id);
    }

    return true;
  } catch {
    return false;
  }
};

export const addToUpNext = async (id: string) => {
  try {
    const resp = await addBookToUpNext(id);
    if (resp.result === 'error') return false;

    upNext.value = [
      ...(upNext.peek() ?? []),
      {
        AudiobookId: id,
        order: Math.max(...upNext.peek().map(({ order }) => order)),
      },
    ];

    return true;
  } catch {
    return false;
  }
};

export const removeFromUpNext = async (id: string) => {
  try {
    const resp = await removeBookFromUpNext(id);
    if (resp.result === 'error') return false;

    const book = rawBooks.peek()?.find(({ id: i }) => i === id);
    if (!book) return false;

    upNext.value = upNext.peek()?.filter(({ AudiobookId }) => AudiobookId !== id);

    return true;
  } catch {
    return false;
  }
};

export const reorderUpNexts = async (ids: string[]) => {
  try {
    const userId = currentUserId.peek();
    if (!userId) return false;

    const resp = await reorderBooks({ bookIds: ids });

    if (resp.result === 'error') return false;

    upNext.value = resp.data.upNexts;

    return true;
  } catch {
    return false;
  }
};

export const equalArray = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((v) => b.includes(v)) && b.every((v) => a.includes(v));
};
