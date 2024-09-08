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
} from '~client/signals/options';
import { Read } from '~client/signals/options/enums';
import { sorters, SortOrder } from '~client/signals/options/sort';
import type { AudiobookJSON } from '~db/models/Audiobook';

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
  signal: Signal<any>,
  opts: { if?: any; unless?: any; any?: boolean },
  cb: BooksMutationWithSignal<any>,
): BooksMutation {
  return (books) => {
    if ('if' in opts || 'unless' in opts) {
      const conditional = opts.if || opts.unless;
      const modBooks = (useCb = true) => {
        if (opts.unless) return useCb ? books : cb(books, signal.value);
        return useCb ? cb(books, signal.value) : books;
      };

      if (Array.isArray(conditional) && Array.isArray(signal.value)) {
        return equalArray(signal.value, conditional) ? modBooks() : modBooks(false);
      }
      if (Array.isArray(conditional)) return conditional.includes(signal.value) ? modBooks() : modBooks(false);
      if (Array.isArray(signal.value)) return signal.value.includes(conditional) ? modBooks() : modBooks(false);
      return conditional === signal.value ? modBooks() : modBooks(false);
    }
    if (opts.any === true) {
      return (Array.isArray(signal.value) ? signal.value.length > 0 : !!signal.value) ? cb(books, signal.value) : books;
    }
    if (opts.any === false) {
      return (Array.isArray(signal.value) ? signal.value.length > 0 : !!signal.value) ? books : cb(books, signal.value);
    }
    return books;
  };
}

export const byTag = conditionalBooksMutation(filterByTag, { any: true }, (books, filterTags) =>
  books.filter(({ id }) =>
    filterTags[filterByTagUnionType.value === 'and' ? 'every' : 'some']((tag) =>
      tags.value?.find(({ name }) => name === tag)?.AudiobookTags?.some(({ AudiobookId }) => AudiobookId === id),
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
  const sortedBooks = books.toSorted(sorters[sortBy.value]);
  if (sortOrder.value === SortOrder.Descending) return sortedBooks.toReversed();
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
