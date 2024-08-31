import { computed, effect, Signal } from '@preact/signals';
import { levenshtein } from 'wuzzy';

import { getBooks, getTags, getUpNext } from '~client/fetches';
import type { AudiobookJSON } from '~db/models/Audiobook';
import type { TagJSON } from '~db/models/Tag';
import type { UpNextJSON } from '~db/models/UpNext';

import { page, pages, perPage, read, refreshToken, search, showUpNext, sortBy, sortOrder } from '../options';
import { Read } from '../options/enums';
import { sorters, SortOrder } from '../options/sort';
import { currentUser } from '../user';

export const rawBooks = new Signal<AudiobookJSON[] | undefined>();
export const tags = new Signal<TagJSON[] | undefined>();
export const upNext = new Signal<Pick<UpNextJSON, 'AudiobookId' | 'order'>[]>([]);

export const selectedBookId = new Signal<string | undefined>();

export const selectedBook = computed(() => {
  if (!selectedBookId.value) return undefined;

  return rawBooks.value?.find(({ id }) => id === selectedBookId.value);
});

const filteredBooks = computed(() => {
  const lowerFilter = search.value.trim().toLocaleLowerCase();

  if (!rawBooks.value) return undefined;

  const readBooks =
    read.value === Read.All
      ? rawBooks.value
      : rawBooks.value.filter(
          ({ UserAudiobooks }) => UserAudiobooks?.some(({ read: r }) => r) === (read.value === Read.Read),
        );

  if (!lowerFilter) return readBooks;

  const exactMatches = readBooks.filter(
    (book) =>
      book.title.toLocaleLowerCase().includes(lowerFilter) ||
      [...(book.Authors || []), ...(book.Narrators || [])].some(({ firstName = '', lastName }) =>
        `${firstName} ${lastName}`.trim().toLocaleLowerCase().includes(lowerFilter),
      ),
  );

  if (exactMatches.length > 0) return exactMatches;

  let fuzzyBooks: AudiobookJSON[] = [];

  let threshold = 0.5;
  do {
    const thr = threshold;
    fuzzyBooks = readBooks.filter(
      (book) =>
        levenshtein(book.title, lowerFilter) > thr ||
        [...(book.Authors || []), ...(book.Narrators || [])].some(
          ({ firstName = '', lastName }) => levenshtein(`${firstName} ${lastName}`.trim(), lowerFilter) > thr,
        ),
    );
    threshold += 0.05;
  } while (fuzzyBooks.length > Math.max(2, Math.min(rawBooks.value.length / 4, 20)));

  return fuzzyBooks;
});

export const stagedUpNextReorder = new Signal<string[] | null>(null);

export const sortedBooks = computed(() => {
  if (!rawBooks.value) return null;

  let sorted: AudiobookJSON[];
  if (showUpNext.value) {
    sorted = (
      stagedUpNextReorder.value
        ? stagedUpNextReorder.value.map((id) => upNext.value.find(({ AudiobookId: i }) => i === id)!)
        : upNext.value
    ).map(({ AudiobookId }) => rawBooks.value!.find(({ id }) => id === AudiobookId)!);
  } else {
    if (!filteredBooks.value) return null;

    sorted = filteredBooks.value.toSorted(sorters[sortBy.value]);
    if (sortOrder.value === SortOrder.Descending) sorted.reverse();
  }

  return sorted;
});

const paginatedBooks = computed(() => {
  const start = Math.min(sortedBooks.value?.length || 0, perPage.value * page.value);
  const end = Math.min(sortedBooks.value?.length || 0, start + perPage.value);
  return sortedBooks.value?.slice(start, end);
});

export const books = paginatedBooks;

effect(() => {
  pages.value = Math.ceil((filteredBooks.value?.length || 0) / perPage.value);
});

effect(() => {
  // eslint-disable-next-line no-unused-expressions
  refreshToken.value;
  // eslint-disable-next-line no-unused-expressions
  currentUser.value;

  getBooks().then((resp) => {
    if (resp.result === 'error') {
      rawBooks.value = undefined;
      return;
    }

    const { audiobooks: bks } = resp.data;
    rawBooks.value = bks;
  });

  getTags().then((resp) => {
    if (resp.result === 'error') {
      tags.value = [];
      return;
    }

    const { tags: v } = resp.data;
    tags.value = v;
  });

  getUpNext().then((resp) => {
    if (resp.result === 'error') {
      upNext.value = [];
      return;
    }

    const { upNexts: v } = resp.data;
    upNext.value = v;
  });
});
