import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { levenshtein } from 'wuzzy';

import { Read } from '~client/contexts/Options/enums';
import { type SortBy, sorters, SortOrder } from '~client/contexts/Options/sort';
import { useUser } from '~client/contexts/User';
import type { AudiobookJSON } from '~db/models/Audiobook';

interface UseBooksResponse {
  books: AudiobookJSON[] | undefined;
  error: string | undefined;
  pages: number;
  refresh: () => void;
  selectedBook: AudiobookJSON | undefined;
  selectBook: (id: string) => void;
  unselectBook: () => void;
  updateBook: (book: AudiobookJSON) => void;
}

const useBooks = ({
  filter = '',
  perPage,
  page,
  read,
  sortBy,
  sortOrder,
}: {
  filter?: string;
  perPage: number;
  page: number;
  read: Read;
  sortBy: SortBy;
  sortOrder: SortOrder;
}): UseBooksResponse => {
  const [error, setError] = useState<string>();
  const [books, setBooks] = useState<AudiobookJSON[]>();
  const [pages, setPages] = useState(1);
  const { user } = useUser();

  const [selectedBookId, setSelectedBookId] = useState<string>();

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return undefined;

    return books?.find(({ id }) => id === selectedBookId);
  }, [books, selectedBookId]);

  const unselectBook = useCallback(() => {
    setSelectedBookId(undefined);
  }, [setSelectedBookId]);

  const filteredBooks = useMemo(() => {
    const lowerFilter = filter.trim().toLocaleLowerCase();

    if (!books) return undefined;

    const readBooks =
      read === Read.All
        ? books
        : books.filter(({ UserAudiobooks }) => UserAudiobooks?.some(({ read: r }) => r) === (read === Read.Read));

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
    } while (fuzzyBooks.length > Math.max(2, Math.min(books.length / 4, 20)));

    return fuzzyBooks;
  }, [books, filter, read]);

  const sortedBooks = useMemo(() => {
    if (!filteredBooks) return null;

    const sorted = [...filteredBooks].sort(sorters[sortBy]);
    if (sortOrder === SortOrder.Descending) sorted.reverse();
    return sorted;
  }, [filteredBooks, sortBy, sortOrder]);

  const paginatedBooks = useMemo(() => {
    const start = Math.min(sortedBooks?.length || 0, perPage * page);
    const end = Math.min(sortedBooks?.length || 0, start + perPage);
    return sortedBooks?.slice(start, end);
  }, [sortedBooks, perPage, page]);

  const [refreshToken, setRefreshToken] = useState<number>();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/books', { headers: { 'x-audiobook-catalog-user': user?.id || '' } });
        const bks = await resp.json();
        if (!resp.ok) throw bks;
        setBooks(bks);
        setPages(Math.ceil(bks.length / perPage));
      } catch (err) {
        setError((err as Error).message);
        setPages(1);
      }
    })();
  }, [user?.id, refreshToken]);

  const refresh = useCallback(() => {
    setRefreshToken(Date.now());
  }, [setRefreshToken]);

  const updateBook = useCallback(
    (book: AudiobookJSON) => {
      setBooks((prev) => prev?.map((b) => (b.id === book.id ? { ...b, ...book } : b)));
    },
    [setBooks],
  );

  return useMemo<UseBooksResponse>(
    () => ({
      books: paginatedBooks,
      error,
      pages,
      refresh,
      selectedBook,
      selectBook: setSelectedBookId,
      unselectBook,
      updateBook,
    }),
    [paginatedBooks, error, pages, selectedBook, setSelectedBookId, unselectBook],
  );
};

export default useBooks;
