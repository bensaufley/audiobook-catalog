import { effect, Signal, useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';

import useEvent, { useThrottledEvent } from '~client/hooks/useEvent';
import { rawBooks, selectedBookId, stagedUpNextReorder, upNext } from '~client/signals/books';
import {
  addToUpNext as upNextBook,
  removeFromUpNext as unUpNextBook,
  reorderUpNexts,
  setBookRead,
} from '~client/signals/books/helpers';
import { showUpNext } from '~client/signals/options';
import { currentUserId } from '~client/signals/user';
import MinusCircleFill from '~icons/dash-circle-fill.svg?react';
import GripVertical from '~icons/grip-vertical.svg?react';
import PlusCircleFill from '~icons/plus-circle-fill.svg?react';
import debounce from '~shared/debounce';

import styles from '~client/components/Book/styles.module.css';

interface Props {
  bookId: string;
}

const draggingBook = new Signal<string | null>(null);
const draggingElement = new Signal<HTMLDivElement | null>(null);
const dragTarget = new Signal<string | null>(null);

effect(() => {
  if (showUpNext.value) return;

  draggingBook.value = null;
  draggingElement.value = null;
});

const reorderBook = (bookId: string, targetId: string, before: boolean) => {
  const order = stagedUpNextReorder.value ?? upNext.peek().map(({ AudiobookId: id }) => id);
  stagedUpNextReorder.value = order.flatMap((id) => {
    if (id === targetId) return before ? [bookId, id] : [id, bookId];
    if (id === bookId) return [];
    return [id];
  });
};

const persistReorder = debounce(async () => {
  const staged = stagedUpNextReorder.peek();

  if (!staged) return;
  if (staged.every((v, i) => upNext.peek()[i]?.AudiobookId === v)) return;

  if (await reorderUpNexts(staged!)) {
    stagedUpNextReorder.value = null;
  }
});

const Book = ({ bookId }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLInputElement>(null);

  const book = useComputed(() => rawBooks.value!.find(({ id }) => id === bookId)!);
  const read = useComputed(
    () => !!book.value.UserAudiobooks?.find(({ UserId }) => UserId === currentUserId.value)?.read,
  );

  const onClick = useEvent((e: JSX.TargetedEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) selectedBookId.value = bookId;
  });

  const changingRead = useSignal(false);
  const changingUpNext = useSignal(false);

  const handleRead = useEvent(async (e: JSX.TargetedEvent<HTMLInputElement>) => {
    e.preventDefault();
    changingRead.value = true;
    const { checked } = e.currentTarget;
    checkRef.current!.checked = !checked;
    if ((await setBookRead(bookId, checked)) && checkRef.current) checkRef.current.checked = checked;
    changingRead.value = false;
  });

  const addToUpNext = useEvent(async (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    e.preventDefault();
    changingUpNext.value = true;
    await upNextBook(bookId);
  });

  const removeFromUpNext = useEvent(async (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    e.preventDefault();
    changingUpNext.value = true;
    await unUpNextBook(bookId);
  });

  const handleDragStart = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.stopImmediatePropagation();
    draggingBook.value = bookId;
    draggingElement.value = ref.current!;
  });

  const handleDrop = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    persistReorder();
    draggingBook.value = null;
    draggingElement.value = null;
  });

  const handleDragEnter = useEvent<JSX.DragEventHandler<HTMLDivElement>>(() => {
    dragTarget.value = bookId;
  });

  const handleDragLeave = useEvent<JSX.DragEventHandler<HTMLDivElement>>(() => {
    dragTarget.value = null;
  });

  const handleDragOverFn = useThrottledEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    if (!draggingBook.value || draggingBook.value === bookId) return;

    const { clientX } = e;
    const { left, width } = ref.current!.getBoundingClientRect();

    const elCenterX = left + width / 2;

    reorderBook(draggingBook.value!, bookId, clientX < elCenterX);
  });

  const handleDragOver = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    if (showUpNext.value && draggingBook.value) handleDragOverFn(e);
  });

  return (
    <div
      class={clsx(styles.container, showUpNext.value && styles.grabbable)}
      draggable={showUpNext}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      ref={ref}
    >
      <div
        role="button"
        tabindex={0}
        class={styles.book}
        onClick={onClick}
        style={{ '--cover': `url('/api/books/${bookId}/cover')` }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onClick(e);
          }
        }}
      >
        <span>{book.value.title}</span>
        {currentUserId.value && (
          <>
            <GripVertical className={styles.grip} />
            {book.value.UpNexts?.length ? (
              <button
                class={clsx(styles.upNext, styles.remove)}
                disabled={changingUpNext}
                type="button"
                aria-label="Remove from Up Next"
                title="Remove from Up Next"
                onClick={removeFromUpNext}
              >
                <MinusCircleFill />
              </button>
            ) : (
              <button
                class={clsx(styles.upNext, styles.add)}
                disabled={changingUpNext}
                type="button"
                aria-label="Add to Up Next"
                title="Add to Up Next"
                onClick={addToUpNext}
              >
                <PlusCircleFill />
              </button>
            )}
            <input disabled={changingRead} ref={checkRef} type="checkbox" onChange={handleRead} checked={read.value} />
          </>
        )}
      </div>
    </div>
  );
};

export default Book;
