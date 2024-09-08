import { useComputed } from '@preact/signals';
import clsx from 'clsx';
import type { ComponentChildren, JSX, Ref } from 'preact';

import { rawBooks } from '~client/signals/books';

import styles from './styles.module.css';

export interface Props {
  bookId: string;
  innerRef?: Ref<HTMLDivElement>;
}

const Base = ({
  bookId,
  children,
  class: className,
  innerRef,
  onClick,
  ...rest
}: Props & {
  children?: ComponentChildren;
  onClick?: (e: JSX.TargetedEvent<HTMLDivElement>) => void;
} & Omit<JSX.IntrinsicElements['div'], 'onClick'>) => {
  const book = useComputed(() => rawBooks.value!.find(({ id }) => id === bookId)!);

  return (
    <div {...rest} class={clsx(styles.container, className)} {...(innerRef ? { ref: innerRef } : {})}>
      <div
        class={styles.book}
        style={{ '--cover': `url('/api/books/${bookId}/cover')` }}
        {...(onClick
          ? {
              role: 'button',
              tabindex: 0,
              onClick,
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onClick(e);
                }
              },
            }
          : {})}
      >
        <span>{book.value.title}</span>
        {children}
      </div>
    </div>
  );
};

export default Base;
