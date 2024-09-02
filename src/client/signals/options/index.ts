import { computed, effect, Signal } from '@preact/signals';

import { SortBy, SortOrder } from '~client/signals/options/sort';

import { currentUserId } from '../user';

import { Read, Size } from './enums';

export const refreshToken = new Signal(0);
export const refresh = () => {
  refreshToken.value = Date.now();
};

export const search = new Signal<string>('');
export const page = new Signal<number>(0);
export const pages = new Signal<number>(1);
export const perPage = new Signal<number>(50);
export const read = new Signal<Read>(Read.All);
export const size = new Signal<Size>(Size.Medium);
export const sortBy = new Signal<SortBy>(SortBy.Author);
export const sortOrder = new Signal<SortOrder>(SortOrder.Ascending);
export const filterByTagUnionType = new Signal<'or' | 'and'>('or');
export const filterByTag = new Signal<string[]>([]);
export const showUpNext = new Signal(false);

effect(() => {
  if (!currentUserId.value) showUpNext.value = false;
});

export const sizeColumns = computed(
  () =>
    ({
      [Size.Small]: 4,
      [Size.Medium]: 3,
      [Size.Large]: 2,
      [Size.XLarge]: 1,
    })[size.value],
);

export const perPageOptions = computed(() => {
  const base = sizeColumns.value * 6;
  return [base * 2, base * 4, base * 8, base * 16];
});

effect(() => {
  if (perPageOptions.value.includes(perPage.peek())) return;

  perPage.value = perPageOptions.value.at(1)!;
});

effect(() => {
  if (sortBy.value === SortBy.DateAdded) sortOrder.value = SortOrder.Descending;
  else sortOrder.value = SortOrder.Ascending;
});

effect(() => {
  if (page.value > pages.value) page.value = pages.value - 1;
});
