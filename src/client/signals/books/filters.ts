import { computed, effect, Signal } from '@preact/signals';
import { levenshtein } from 'wuzzy';

import {
  filterByTag,
  filterByTagUnionType,
  page,
  pages,
  perPage,
  read,
  search,
  showUpNext,
  sortBy,
  sortOrder,
  UNTAGGED,
} from '~client/signals/options';
import { Read } from '~client/signals/options/enums';
import { SortBy, sorters, SortOrder } from '~client/signals/options/sort';
import type { AudiobookJSON } from '~db/models/Audiobook.js';

import { equalArray } from './helpers';
import { rawBooks, readBooks, stagedUpNextReorder, tags, upNext } from '.';

type BooksMutation = (books: AudiobookJSON[]) => AudiobookJSON[];
type BooksMutationWithSignal<T> = (books: AudiobookJSON[], signalValue: T) => AudiobookJSON[];
function conditionalBooksMutation<T>(
  signal: Signal<T>,
  opts: { if: NonNullable<T> | NonNullable<T>[] },
  filter: BooksMutationWithSignal<NonNullable<T>>,
): BooksMutation;
function conditionalBooksMutation<T>(
  signal: Signal<T>,
  opts: { unless: NonNullable<T> | NonNullable<T>[] },
  filter: BooksMutationWithSignal<NonNullable<T>>,
): BooksMutation;
function conditionalBooksMutation<T>(
  signal: Signal<T>,
  opts: { any: boolean },
  filter: BooksMutationWithSignal<NonNullable<T>>,
): BooksMutation;
function conditionalBooksMutation(
  signal: Signal<unknown>,
  opts: { if: unknown } | { unless: unknown } | { any: boolean },
  cb: BooksMutationWithSignal<unknown>,
): BooksMutation {
  return (books) => {
    let matches = false;
    let inverse = false;

    const sigVal = signal.value;

    if ('any' in opts) {
      matches = Array.isArray(sigVal) ? sigVal.length > 0 : !!sigVal;
      inverse = !opts.any;
    } else {
      let comparison: unknown;
      if ('if' in opts) {
        comparison = opts.if;
      } else {
        comparison = opts.unless;
        inverse = true;
      }

      if (Array.isArray(comparison) && Array.isArray(sigVal)) {
        matches = equalArray(sigVal, comparison);
      } else if (Array.isArray(comparison)) {
        matches = comparison.includes(sigVal);
      } else if (Array.isArray(sigVal)) {
        matches = sigVal.includes(comparison);
      } else {
        matches = comparison === sigVal;
      }
    }

    if (matches) return inverse ? books : cb(books, sigVal);
    return inverse ? cb(books, sigVal) : books;
  };
}

export const byTag = conditionalBooksMutation(filterByTag, { any: true }, (books, filterTags) =>
  books.filter(({ id }) =>
    filterTags[filterByTagUnionType.value === 'and' ? 'every' : 'some']((tag) =>
      tag === UNTAGGED
        ? !tags.value?.some(({ AudiobookTags = [] }) => AudiobookTags.some(({ AudiobookId }) => AudiobookId === id))
        : tags.value?.find(({ name }) => name === tag)?.AudiobookTags?.some(({ AudiobookId }) => AudiobookId === id),
    ),
  ),
);

export const byReadStatus = conditionalBooksMutation(read, { unless: Read.All }, (books, status) =>
  books.filter(({ id }) => (status === Read.Read ? readBooks.value?.includes(id) : !readBooks.value?.includes(id))),
);

export const bySearchString = conditionalBooksMutation(search, { unless: '' }, (books, searchString) => {
  const lowerFilter = searchString.trim().toLocaleLowerCase();
  const exactMatches = books.filter(
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
    fuzzyBooks = books.filter(
      (book) =>
        levenshtein(book.title, lowerFilter) > thr ||
        [...(book.Authors || []), ...(book.Narrators || [])].some(
          ({ firstName = '', lastName }) => levenshtein(`${firstName} ${lastName}`.trim(), lowerFilter) > thr,
        ),
    );
    threshold += 0.05;
  } while (fuzzyBooks.length > Math.max(2, Math.min(rawBooks.value!.length / 4, 20)));

  return fuzzyBooks;
});

export const displayUpNext = conditionalBooksMutation(showUpNext, { if: true }, () =>
  (stagedUpNextReorder.value?.map((id) => upNext.value.find(({ AudiobookId: i }) => i === id)!) ?? upNext.value).map(
    ({ AudiobookId }) => rawBooks.value!.find(({ id }) => id === AudiobookId)!,
  ),
);

export const sorted = conditionalBooksMutation(showUpNext, { unless: true }, (books) => {
  let sortedBooks = books.toSorted(sorters[sortBy.value]);
  if (sortOrder.value === SortOrder.Descending) sortedBooks.reverse();
  if (sortBy.value === SortBy.Duration) {
    sortedBooks = sortedBooks
      .filter(({ duration }) => !!duration)
      .concat(sortedBooks.filter(({ duration }) => !duration));
  }
  return sortedBooks;
});

export const paginated: BooksMutation = (books) => {
  const start = Math.min(books.length || 0, perPage.value * page.value);
  const end = Math.min(books.length || 0, start + perPage.value);
  return books.slice(start, end);
};

const filtered =
  (...filters: (BooksMutation | [Signal<AudiobookJSON[] | undefined>, BooksMutation])[]) =>
  (books: AudiobookJSON[] | undefined) =>
    books === undefined
      ? undefined
      : filters.reduce((acc, ff) => {
          let mutation: BooksMutation;
          let signal: Signal<any> | undefined;
          if (typeof ff === 'function') {
            mutation = ff;
          } else {
            [signal, mutation] = ff;
          }
          const result = mutation(acc);
          if (signal) signal.value = result;
          return result;
        }, books);

export const filteredBooks = new Signal<AudiobookJSON[] | undefined>(undefined);

effect(() => {
  pages.value = Math.ceil((filteredBooks.value?.length || 0) / perPage.value);
});

export const books = computed(() =>
  filtered(byTag, byReadStatus, bySearchString, displayUpNext, [filteredBooks, sorted], paginated)(rawBooks.value),
);
