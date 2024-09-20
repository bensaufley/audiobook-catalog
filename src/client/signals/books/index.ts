import { computed, effect, Signal } from '@preact/signals';

import { getBooks, getRead, getTags, getUpNext } from '~client/fetches';
import type { Response } from '~client/fetches/createFetch';
import type { AudiobookJSON } from '~db/models/Audiobook.js';
import type { TagJSON } from '~db/models/Tag.js';
import type { UpNextJSON } from '~db/models/UpNext.js';

import { refreshToken } from '../options';
import { currentUser } from '../user';

export const rawBooks = new Signal<AudiobookJSON[] | undefined>();
export const readBooks = new Signal<string[] | undefined>();
export const tags = new Signal<TagJSON[] | undefined>();
export const upNext = new Signal<Pick<UpNextJSON, 'AudiobookId' | 'order'>[]>([]);

export const bulkTag = new Signal<string | undefined>();
export const stagedUpNextReorder = new Signal<string[] | null>(null);

export const selectedBookId = new Signal<string | undefined>();

export const selectedBook = computed(() => {
  if (!selectedBookId.value) return undefined;

  return rawBooks.value?.find(({ id }) => id === selectedBookId.value);
});

export const untaggedBooks = computed(() =>
  (rawBooks.value ?? [])?.filter(
    (book) =>
      !tags.value?.some(({ AudiobookTags = [] }) => AudiobookTags.some(({ AudiobookId }) => AudiobookId === book.id)),
  ),
);

/* eslint-disable no-param-reassign */
const updateSignal = async <T, R>(
  signal: Signal<T>,
  defaultValue: T,
  fetcher: () => Promise<Response<R>>,
  key: { [k in keyof R]: R[k] extends T ? k : never }[keyof R],
) => {
  const resp = await fetcher();

  if (resp.result === 'error') {
    signal.value = defaultValue;
    return;
  }

  signal.value = resp.data[key] as T;
};
/* eslint-enable no-param-reassign */

effect(() => {
  // eslint-disable-next-line no-unused-expressions
  refreshToken.value;

  updateSignal(rawBooks, undefined, getBooks, 'audiobooks');
  updateSignal(tags, [], getTags, 'tags');

  if (currentUser.value) {
    updateSignal(readBooks, [], getRead, 'bookIds');
    updateSignal(upNext, [], getUpNext, 'upNexts');
  }
});
