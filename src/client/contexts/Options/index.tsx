import { createContext, FunctionComponent, h } from 'preact';
import { useContext, useMemo, useState } from 'preact/hooks';

export enum Size {
  Small,
  Medium,
  Large,
  XLarge,
}

export interface OptionValues {
  filter: string;
  page: number;
  pages: number;
  perPage: number;
  size: Size;
}

export type Options = OptionValues & {
  changeFilter: (filter: string) => void;
  changePage: (cb: (current: number) => number) => void;
  changePages: (p: number) => void;
  changePerPage: (perPage: number) => void;
  changeSize: (size: Size) => void;
};

const defaultOpts: OptionValues = {
  filter: '',
  page: 0,
  pages: 1,
  perPage: 50,
  size: Size.Medium,
};

const noop = () => {
  /* noop */
};

const OptionsContext = createContext<Options>({
  ...defaultOpts,
  changeFilter: noop,
  changePage: noop,
  changePages: noop,
  changePerPage: noop,
  changeSize: noop,
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
  const [pages, changePages] = useState(1);
  const [perPage, changePerPage] = useState(50);

  const value = useMemo(
    () => ({
      changeFilter,
      changePage,
      changePages,
      changePerPage,
      changeSize,
      filter,
      page,
      pages,
      perPage,
      size,
    }),
    [changeFilter, changeSize, filter, size],
  );
  return <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>;
};
