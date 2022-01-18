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
  size: Size;
}

export type Options = OptionValues & {
  changeSize: (size: Size) => void;
  changeFilter: (filter: string) => void;
};

const defaultOpts: OptionValues = {
  filter: '',
  size: Size.Medium,
};

const noop = () => {
  /* noop */
};

const OptionsContext = createContext<Options>({
  ...defaultOpts,
  changeFilter: noop,
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

  const value = useMemo(
    () => ({
      changeFilter,
      changeSize,
      filter,
      size,
    }),
    [changeFilter, changeSize, filter, size],
  );
  return <OptionsContext.Provider value={value}>{children}</OptionsContext.Provider>;
};
