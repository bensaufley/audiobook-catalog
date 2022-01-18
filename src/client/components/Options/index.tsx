import { FunctionComponent, Fragment, h } from 'preact';

import { Size, useOptions } from '~client/components/contexts/Options';
import styles from '~client/components/Options/styles.module.css';
import { useCallback, useMemo } from 'preact/hooks';

const Options: FunctionComponent = () => {
  const { changeSize, size } = useOptions();

  const handleChange: h.JSX.GenericEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      changeSize(Number(e.currentTarget.value) as Size);
    },
    [changeSize],
  );

  return (
    <div class={styles.sizes}>
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
    </div>
  );
};

export default Options;
