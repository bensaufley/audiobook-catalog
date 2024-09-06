import { createTag, deleteTag as delTag, tagBook, untagBook } from '~client/fetches';
import { tags } from '~client/signals/books';
import type AudiobookTag from '~db/models/AudiobookTag';

const sortTags = (a: { name: string }, b: { name: string }) =>
  a.name.localeCompare(b.name, undefined, { caseFirst: 'false' });

export const makeTag = async (name: string, color: `#${string}`, bookId?: string) => {
  const resp = await createTag({ name, color, bookId });
  if (resp.result === 'error') return false;

  tags.value = [...(tags.peek() ?? []), resp.data.tag].toSorted(sortTags);
  return true;
};

export const deleteTag = async (name: string) => {
  const resp = await delTag({ name });
  if (resp.result === 'error') return false;

  tags.value = tags
    .peek()
    ?.filter((tag) => tag.name !== name)
    .toSorted(sortTags);
  return true;
};

export const addTagToBook = async (name: string, bookId: string) => {
  const resp = await tagBook(bookId, { name });
  if (resp.result === 'error') return false;

  tags.value = tags
    .peek()
    ?.map((tag) =>
      tag.name === name
        ? { ...tag, AudiobookTags: [...(tag.AudiobookTags ?? []), { AudiobookId: bookId } as AudiobookTag] }
        : tag,
    )
    .toSorted(sortTags);
  return true;
};

export const removeTagFromBook = async (name: string, bookId: string) => {
  const resp = await untagBook(bookId, { name });
  if (resp.result === 'error') return false;

  tags.value = tags
    .peek()
    ?.map((tag) =>
      tag.name === name
        ? { ...tag, AudiobookTags: tag.AudiobookTags?.filter(({ AudiobookId }) => AudiobookId !== bookId) ?? [] }
        : tag,
    )
    .toSorted(sortTags);
  return true;
};
