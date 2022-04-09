import { FunctionComponent, Fragment, h } from 'preact';

import { Size, useOptions } from '~client/contexts/Options';
import styles from '~client/contexts/Options/styles.module.css';
import { useCallback } from 'preact/hooks';

const Options: FunctionComponent = () => {
  const { changeFilter, changePage, changeSize, filter, page, pages, size } = useOptions();

  const handleChangeSize: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      changeSize(Number(e.currentTarget.value) as Size);
    },
    [changeSize],
  );

  const handleChangePage: h.JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changePage(() => Number(value));
    },
    [changePage, page],
  );

  const handleSearch: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changeFilter(value);
    },
    [changeFilter],
  );

  return (
    <div class={styles.options}>
      <label for="page">Page:</label>
      <select name="page" id="page" onChange={handleChangePage}>
        {[...new Array(pages)].map((_, i) => (
          <option value={i} selected={page === i}>
            {i + 1}
          </option>
        ))}
      </select>
      <label for="size">Size:</label>
      <input
        type="range"
        id="size"
        name="size"
        min={Size.Small}
        max={Size.XLarge}
        value={size}
        onInput={handleChangeSize}
      />
      <label for="filter">Filter:</label>
      <input type="search" name="filter" id="filter" onInput={handleSearch} value={filter} />
    </div>
  );
};

export default Options;
