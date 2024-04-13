import type { FunctionComponent } from 'preact';
import { useCallback } from 'preact/hooks';

import { useOptions } from '~client/contexts/Options';
import type { Read, Size } from '~client/contexts/Options/enums';
import { SortBy, SortOrder } from '~client/contexts/Options/sort';
import { useUser } from '~client/contexts/User';

import styles from '~client/contexts/Options/styles.module.css';

const Options: FunctionComponent = () => {
  const {
    changeFilter,
    changePage,
    changePerPage,
    changeRead,
    changeSize,
    changeSortBy,
    changeSortOrder,
    filter,
    page,
    pages,
    perPage,
    read,
    size,
    sortBy,
    sortOrder,
  } = useOptions();

  const { user } = useUser();

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

  const handleChangePerPage: h.JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changePerPage(parseInt(value, 10));
    },
    [changePerPage],
  );

  const handleChangeRead: h.JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changeRead(value as Read);
    },
    [changeRead],
  );

  const handleSearch: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changeFilter(value);
    },
    [changeFilter],
  );

  const handleChangeSortBy: h.JSX.GenericEventHandler<HTMLSelectElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changeSortBy(SortBy[value as keyof typeof SortBy]);
    },
    [changeSortBy],
  );

  const handleChangeSortOrder: h.JSX.GenericEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();

      changeSortOrder((o) => (o === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending));
    },
    [changeSortOrder],
  );

  return (
    <div class={styles.options}>
      {user && (
        <select name="read" id="read" onChange={handleChangeRead}>
          {Object.entries(Read).map(([k, v]) => (
            <option value={k} selected={read === k}>
              {v}
            </option>
          ))}
        </select>
      )}
      <label for="sort-by">Sort By:</label>
      <select name="sort-by" id="sort-by" onChange={handleChangeSortBy}>
        {Object.entries(SortBy).map(([k, v]) => (
          <option value={k} selected={sortBy === k}>
            {v}
          </option>
        ))}
      </select>
      <button type="button" onClick={handleChangeSortOrder}>
        {sortOrder === SortOrder.Ascending ? <>⌃</> : <>⌄</>}
      </button>
      <label for="page">Page:</label>
      <select name="page" id="page" onChange={handleChangePage}>
        {[...new Array(pages)].map((_, i) => (
          <option value={i} selected={page === i}>
            {i + 1}
          </option>
        ))}
      </select>
      <label for="per-page">Per Page:</label>
      <select name="per-page" id="per-page" onChange={handleChangePerPage}>
        {[...new Array(5)].map((_, i) => (
          <option value={(i + 1) * 20} selected={perPage === (i + 1) * 20}>
            {(i + 1) * 20}
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
