import { addBookToUpNext, readBook, removeBookFromUpNext, reorderBooks, unreadBook } from '~client/fetches';
import type { AudiobookJSON } from '~db/models/Audiobook';
import type { UserAudiobookJSON } from '~db/models/UserAudiobook';

import { currentUserId } from '../User';

import { rawBooks, upNext } from '.';

export const updateBook = (book: Partial<AudiobookJSON>) => {
  rawBooks.value = rawBooks.peek()?.map((b) => (b.id === book.id ? { ...b, ...book } : b));
};

export const setBookRead = async (id: string, read: boolean) => {
  try {
    if (!currentUserId.peek()) return false;

    const book = rawBooks.peek()?.find(({ id: i }) => i === id);
    if (!book) return false;

    const resp = await (read ? readBook(id) : unreadBook(id));

    if (resp.result === 'error') return false;

    const ua = book.UserAudiobooks?.some(({ UserId }) => UserId === currentUserId.value!);
    const UserAudiobooks: UserAudiobookJSON[] = ua
      ? book.UserAudiobooks!.map((x) =>
          x.UserId === currentUserId.value! ? { ...x, read, updatedAt: new Date().toISOString() } : x,
        )
      : [
          ...(book.UserAudiobooks ?? []),
          {
            read,
            UserId: currentUserId.value!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            AudiobookId: book.id,
          },
        ];
    updateBook({ id, UserAudiobooks });

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
