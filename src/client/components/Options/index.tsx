import { FunctionComponent, Fragment, h } from 'preact';

import { Size, useOptions } from '~client/components/contexts/Options';
import styles from '~client/components/Options/styles.module.css';
import { useCallback, useMemo } from 'preact/hooks';

const Options: FunctionComponent = () => {
  const { changeFilter, changeSize, filter, size } = useOptions();

  const handleChange: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      changeSize(Number(e.currentTarget.value) as Size);
    },
    [changeSize],
  );

  const handleSearch: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    ({ currentTarget: { value } }) => {
      changeFilter(value);
    },
    [changeFilter],
  );

  return (
    <div class={styles.options}>
      <label for="size">Size:</label>
      <input
        type="range"
        id="size"
        name="size"
        min={Size.Small}
        max={Size.XLarge}
        value={size}
        onInput={handleChange}
      />
      <label for="filter">Filter:</label>
      <input type="search" name="filter" id="filter" onInput={handleSearch} value={filter} />
    </div>
  );
};

export default Options;
