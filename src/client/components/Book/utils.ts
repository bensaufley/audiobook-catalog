import { effect, Signal } from '@preact/signals';

import { stagedUpNextReorder, upNext } from '~client/signals/books';
import { reorderUpNexts } from '~client/signals/books/helpers';
import { showUpNext } from '~client/signals/options';
import debounce from '~shared/debounce';

export const draggingBook = new Signal<string | null>(null);
export const draggingElement = new Signal<HTMLDivElement | null>(null);
export const dragTarget = new Signal<string | null>(null);

effect(() => {
  if (showUpNext.value) return;

  draggingBook.value = null;
  draggingElement.value = null;
});

export const reorderBook = (bookId: string, targetId: string, before: boolean) => {
  const order = stagedUpNextReorder.value ?? upNext.peek().map(({ AudiobookId: id }) => id);
  stagedUpNextReorder.value = order.flatMap((id) => {
    if (id === targetId) return before ? [bookId, id] : [id, bookId];
    if (id === bookId) return [];
    return [id];
  });
};

export const persistReorder = debounce(async () => {
  const staged = stagedUpNextReorder.peek();

  if (!staged) return;
  if (staged.every((v, i) => upNext.peek()[i]?.AudiobookId === v)) return;

  if (await reorderUpNexts(staged!)) {
    stagedUpNextReorder.value = null;
  }
});
