import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';

import useEvent, { useThrottledEvent } from '~client/hooks/useEvent';
import { stagedUpNextReorder, upNext } from '~client/signals/books';
import { showUpNext } from '~client/signals/options';
import GripVertical from '~icons/grip-vertical.svg?react';

import Base, { type Props } from './Base';
import { draggingBook, draggingElement, dragTarget, persistReorder, reorderBook } from './utils';

import styles from './styles.module.css';

const DraggableBook = ({ bookId }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
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

  const handleDragOverFn = useThrottledEvent<JSX.DragEventHandler<HTMLDivElement>>(() => {
    if (!draggingBook.value || draggingBook.value === bookId) return;

    const order = stagedUpNextReorder.value ?? upNext.peek().map(({ AudiobookId: id }) => id);

    const draggingBookIndex = order.indexOf(draggingBook.value);
    const thisBookIndex = order.indexOf(bookId);

    reorderBook(draggingBook.value!, bookId, draggingBookIndex > thisBookIndex);
  });

  const handleDragOver = useEvent<JSX.DragEventHandler<HTMLDivElement>>((e) => {
    e.preventDefault();
    if (showUpNext.value && draggingBook.value) handleDragOverFn(e);
  });

  return (
    <Base
      key={bookId}
      bookId={bookId}
      class={styles.grabbable}
      draggable={showUpNext}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      innerRef={ref}
    >
      <GripVertical className={styles.grip} />
    </Base>
  );
};

export default DraggableBook;
