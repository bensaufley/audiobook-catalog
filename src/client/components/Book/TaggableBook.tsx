import { useComputed, useSignal } from '@preact/signals';
import clsx from 'clsx';

import { untagBook } from '~client/fetches';
import useEvent from '~client/hooks/useEvent';
import { bulkTag as bulkTagSignal, tags } from '~client/signals/books';

import type { Props } from './Base';
import Base from './Base';
import { booksToTag } from './tagging';

import styles from './styles.module.css';

const TaggableBook = ({ bookId }: Props) => {
  const tag = useComputed(() => tags.value?.find(({ name }) => name === bulkTagSignal.value));

  const isTagged = useComputed(
    () => tag.value?.AudiobookTags?.some(({ AudiobookId }) => AudiobookId === bookId) ?? false,
  );

  const untagging = useSignal(false);

  const tagBook = useEvent(async (e: Event) => {
    e.preventDefault();
    if (isTagged.value) {
      untagging.value = true;
      const resp = await untagBook(bookId, { name: bulkTagSignal.value! });
      untagging.value = false;
      if (resp.result === 'error') return;
      tags.value = tags
        .peek()
        ?.map((t) =>
          t.name === bulkTagSignal.value
            ? { ...t, AudiobookTags: t.AudiobookTags?.filter(({ AudiobookId }) => AudiobookId !== bookId) ?? [] }
            : t,
        );
    } else {
      booksToTag.value = [...booksToTag.peek(), bookId];
    }
  });

  return (
    <Base
      bookId={bookId}
      class={clsx(styles.taggable, isTagged.value && styles.tagged)}
      onClick={tagBook}
      style={{ '--tagColor': tag.value?.color ?? 'transparent' }}
    >
      {(booksToTag.value.includes(bookId) || untagging.value) && (
        <div class={styles.loading}>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </Base>
  );
};

export default TaggableBook;
