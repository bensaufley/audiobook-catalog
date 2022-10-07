import { createContext, FunctionComponent, h } from 'preact';
import { StateUpdater, useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { SortBy, SortOrder } from '~client/contexts/Options/sort';
import useBooks from '~client/contexts/Options/useBooks';
import { useUser } from '~client/contexts/User';
import type { AudiobookJSON } from '~db/models/Audiobook';

export enum Size {
  Small,
  Medium,
  Large,
  XLarge,
}

export enum Read {
  All = 'All',
  Unread = 'Unread',
  Read = 'Read',
}

export interface OptionValues {
  books: AudiobookJSON[] | undefined;
  error: string | undefined;
  filter: string;
  page: number;
  pages: number;
  perPage: number;
  read: Read;
  selectedBook: AudiobookJSON | undefined;
  size: Size;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export type Options = OptionValues & {
  changeFilter: StateUpdater<string>;
  changePage: StateUpdater<number>;
  changePerPage: StateUpdater<number>;
  changeRead: StateUpdater<Read>;
  changeSize: StateUpdater<Size>;
  changeSortBy: StateUpdater<SortBy>;
  changeSortOrder: StateUpdater<SortOrder>;
  selectBook: (id: string) => void;
  unselectBook: () => void;
  updateBook: (book: AudiobookJSON) => void;

  refresh: () => void;
};

const defaultOpts: OptionValues = {
  books: undefined,
  error: undefined,
  filter: '',
  page: 0,
  pages: 1,
  perPage: 50,
  read: Read.All,
  selectedBook: undefined,
  sortBy: SortBy.Author,
  sortOrder: SortOrder.Ascending,
  size: Size.Medium,
};

const noop = () => {
  /* noop */
};

const OptionsContext = createContext<Options>({
  ...defaultOpts,
  changeFilter: noop,
  changePage: noop,
  changePerPage: noop,
  changeRead: noop,
  changeSize: noop,
  changeSortBy: noop,
  changeSortOrder: noop,
  selectBook: noop,
  unselectBook: noop,
  updateBook: noop,
  refresh: noop,
});

export const useOptions = () => useContext(OptionsContext);

export const useSizeColumns = () => {
  const { size } = useOptions();

  switch (size) {
    case Size.Small:
      return 4;
    case Size.Medium:
      return 3;
    case Size.Large:
      return 2;
    case Size.XLarge:
      return 1;
  }
};

export const OptionsProvider: FunctionComponent<Partial<OptionValues>> = ({ children, ...opts }) => {
  const [size, changeSize] = useState(opts.size || defaultOpts.size);
  const [filter, changeFilter] = useState(opts.filter || defaultOpts.filter);
  const [page, changePage] = useState(0);
  const [perPage, changePerPage] = useState(60);
  const [read, changeRead] = useState(Read.All);

  const [sortBy, changeSortBy] = useState(SortBy.Author);
  const [sortOrder, changeSortOrder] = useState(SortOrder.Ascending);

  useEffect(() => {
    if (sortBy === SortBy.DateAdded) changeSortOrder(SortOrder.Descending);
    else changeSortOrder(SortOrder.Ascending);
  }, [sortBy]);

  const { books, error, pages, refresh, selectedBook, selectBook, unselectBook, updateBook } = useBooks({
    filter,
    perPage,
    page,
    read,
    sortBy,
    sortOrder,
  });

  useEffect(() => {
    if (page > pages) changePage(pages - 1);
  }, [page, pages, changePage]);

  const value = useMemo<Options>(
    () => ({
      books,
      changeFilter,
      changePage,
      changePerPage,
      changeRead,
      changeSize,
      changeSortBy,
      changeSortOrder,
      error,
      filter,
      page,
      pages,
      perPage,
      read,
      refresh,
      selectBook,
      selectedBook,
      size,
      sortBy,
      sortOrder,
      unselectBook,
      updateBook,
    }),
    [
      books,
      changeFilter,
      changePage,
      changePerPage,
      changeRead,
      changeSize,
      changeSortBy,
      changeSortOrder,
      error,
      filter,
      page,
      pages,
      perPage,
      read,
      refresh,
      selectBook,
      selectedBook,
      size,
      sortBy,
      sortOrder,
      unselectBook,
      updateBook,
    ],
  );
  return <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>;
};
