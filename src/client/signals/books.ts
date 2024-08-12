import { computed, Signal } from '@preact/signals';

import type { AudiobookJSON } from '~db/models/Audiobook';
import type { UserAudiobookJSON } from '~db/models/UserAudiobook';

import { currentUserId } from './User';

export const rawBooks = new Signal<AudiobookJSON[] | undefined>();

export const updateBook = (book: Partial<AudiobookJSON>) => {
  rawBooks.value = rawBooks.peek()?.map((b) => (b.id === book.id ? { ...b, ...book } : b));
};

export const setBookRead = async (id: string, read: boolean) => {
  try {
    if (!currentUserId.peek()) return false;

    const book = rawBooks.peek()?.find(({ id: i }) => i === id);
    if (!book) return false;

    const path = read ? 'read' : 'unread';
    const resp = await fetch(`/users/books/${id}/${path}`, {
      headers: {
        'x-audiobook-catalog-user': currentUserId.peek()!,
      },
      method: 'POST',
    });

    if (!resp.ok) return false;

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

export const selectedBookId = new Signal<string | undefined>();

export const selectedBook = computed(() => {
  if (!selectedBookId.value) return undefined;

  return rawBooks.value?.find(({ id }) => id === selectedBookId.value);
});
