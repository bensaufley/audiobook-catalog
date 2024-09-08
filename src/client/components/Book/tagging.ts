import { Signal } from '@preact/signals';

import { bulkTagBooks } from '~client/fetches';
import { bulkTag as bulkTagSignal, tags } from '~client/signals/books';
import debounce from '~shared/debounce';

export const booksToTag = new Signal<string[]>([]);

export const bulkTag = debounce(async (bookIds: string[], tagName: string) => {
  const resp = await bulkTagBooks({ tagName }, { bookIds });
  if (resp.result === 'error') return;
  booksToTag.value = [];
  tags.value = tags.peek()?.map((tag) => (tag.name === tagName ? resp.data.tag : tag)) ?? [resp.data.tag];
}, 1_000);

bulkTagSignal.subscribe(() => {
  booksToTag.value = [];
});

booksToTag.subscribe((bookIds) => {
  if (!bookIds.length || !bulkTagSignal.peek()) return;

  bulkTag(bookIds, bulkTagSignal.peek()!);
});
