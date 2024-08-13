import { batch, computed, effect, Signal } from '@preact/signals';
import { levenshtein } from 'wuzzy';

import { SortBy, sorters, SortOrder } from '~client/signals/Options/sort';
import type { AudiobookJSON } from '~db/models/Audiobook';

import { rawBooks } from '../books';
import { currentUserId } from '../User';

import { Read, Size } from './enums';

export const refreshToken = new Signal(0);
export const refresh = () => {
  refreshToken.value = Date.now();
};

export const error = new Signal<string | undefined>();
export const search = new Signal<string>('');
export const page = new Signal<number>(0);
export const pages = new Signal<number>(1);
export const perPage = new Signal<number>(50);
export const read = new Signal<Read>(Read.All);
export const size = new Signal<Size>(Size.Medium);
export const sortBy = new Signal<SortBy>(SortBy.Author);
export const sortOrder = new Signal<SortOrder>(SortOrder.Ascending);

export const sizeColumns = computed(
  () =>
    ({
      [Size.Small]: 4,
      [Size.Medium]: 3,
      [Size.Large]: 2,
      [Size.XLarge]: 1,
    })[size.value],
);

export const perPageOptions = computed(() => {
  const base = sizeColumns.value * 6;
  return [base * 2, base * 4, base * 8, base * 16];
});

effect(() => {
  if (perPageOptions.value.includes(perPage.peek())) return;

  perPage.value = perPageOptions.value.at(0)!;
});

effect(() => {
  if (sortBy.value === SortBy.DateAdded) sortOrder.value = SortOrder.Descending;
  else sortOrder.value = SortOrder.Ascending;
});

effect(() => {
  if (page.value > pages.value) page.value = pages.value - 1;
});

effect(() => {
  // eslint-disable-next-line no-unused-expressions
  refreshToken.value;

  fetch('/api/books', { headers: { 'x-audiobook-catalog-user': currentUserId.value || '' } })
    .then((resp) => Promise.all([resp.ok, resp.json() as Promise<AudiobookJSON[]>]))
    .then(([ok, bks]) => {
      if (!ok) throw bks;

      rawBooks.value = bks;
    })
    .catch((err) => {
      batch(() => {
        error.value = (err as Error).message;
        rawBooks.value = undefined;
      });
    });
});

// BOOKS

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

export const sortedBooks = computed(() => {
  if (!filteredBooks.value) return null;

  const sorted = [...filteredBooks.value].sort(sorters[sortBy.value]);
  if (sortOrder.value === SortOrder.Descending) sorted.reverse();
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
