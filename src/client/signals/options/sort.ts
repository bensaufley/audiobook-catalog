import type { AudiobookJSON } from '~db/models/Audiobook.js';
import { sortBy } from '~shared/utilities';

export enum SortBy {
  Author = 'Author',
  DateAdded = 'Date Added',
  Duration = 'Duration',
  Title = 'Title',
}

export enum SortOrder {
  Ascending,
  Descending,
}

export const sorters: { [k in SortBy]: (a: AudiobookJSON, b: AudiobookJSON) => number } = {
  [SortBy.Author]: ({ Authors: a = [] }, { Authors: b = [] }) => {
    if (!a?.length && !b?.length) return 0;
    if (!a?.length) return -1;
    if (!b?.length) return 1;

    const aAuthors = a.map(({ lastName }) => lastName.toLocaleLowerCase()).join(', ');
    const bAuthors = b.map(({ lastName }) => lastName.toLocaleLowerCase()).join(', ');
    if (aAuthors < bAuthors) return -1;
    if (aAuthors > bAuthors) return 1;
    return 0;
  },
  [SortBy.DateAdded]: ({ createdAt: a }, { createdAt: b }) => Date.parse(a) - Date.parse(b),
  [SortBy.Title]: sortBy('title'),
  [SortBy.Duration]: sortBy('duration', 'last'),
};
