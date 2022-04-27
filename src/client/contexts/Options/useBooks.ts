import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { levenshtein } from 'wuzzy';
import { SortBy, sorters, SortOrder } from '~client/contexts/Options/sort';
import type { AudiobookJSON } from '~db/models/Audiobook';

interface UseBooksResponse {
  books: AudiobookJSON[] | undefined;
  error: string | undefined;
  pages: number;
  selectedBook: AudiobookJSON | undefined;
  selectBook: (id: string) => void;
  unselectBook: () => void;
}

const useBooks = ({
  filter = '',
  perPage,
  page,
  sortBy,
  sortOrder,
}: {
  filter?: string;
  perPage: number;
  page: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}): UseBooksResponse => {
  const [error, setError] = useState<string>();
  const [books, setBooks] = useState<AudiobookJSON[]>();
  const [pages, setPages] = useState(1);

  const [selectedBookId, setSelectedBookId] = useState<string>();

  const selectedBook = useMemo(() => {
    if (!selectedBookId) return undefined;

    return books?.find(({ id }) => id === selectedBookId)!;
  }, [books, selectedBookId]);

  const unselectBook = useCallback(() => {
    setSelectedBookId(undefined);
  }, [setSelectedBookId]);

  const filteredBooks = useMemo(() => {
    const lowerFilter = filter.trim().toLocaleLowerCase();

    if (!lowerFilter) return books;

    if (!books) return undefined;

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
      fuzzyBooks = books.filter(
        (book) =>
          levenshtein(book.title, lowerFilter) > threshold ||
          [...(book.Authors || []), ...(book.Narrators || [])].some(
            ({ firstName = '', lastName }) => levenshtein(`${firstName} ${lastName}`.trim(), lowerFilter) > threshold,
          ),
      );
      threshold += 0.05;
    } while (fuzzyBooks.length > Math.max(2, Math.min(books.length / 4, 20)));

    return fuzzyBooks;
  }, [books, filter]);

  const sortedBooks = useMemo(() => {
    if (!filteredBooks) return;

    const sorted = [...filteredBooks].sort(sorters[sortBy]);
    if (sortOrder === SortOrder.Descending) sorted.reverse();
    return sorted;
  }, [filteredBooks, sortBy, sortOrder]);

  const paginatedBooks = useMemo(() => {
    const start = Math.min(sortedBooks?.length || 0, perPage * page);
    const end = Math.min(sortedBooks?.length || 0, start + perPage);
    return sortedBooks?.slice(start, end);
  }, [sortedBooks, perPage, page]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/books');
        const bks = await resp.json();
        if (!resp.ok) throw bks;
        setBooks(bks);
        setPages(Math.ceil(bks.length / perPage));
      } catch (err) {
        setError((err as Error).message);
        setPages(1);
      }
    })();
  }, []);

  return useMemo<UseBooksResponse>(
    () => ({
      books: paginatedBooks,
      error,
      pages,
      selectedBook,
      selectBook: setSelectedBookId,
      unselectBook,
    }),
    [paginatedBooks, error, pages, selectedBook, setSelectedBookId, unselectBook],
  );
};

export default useBooks;
