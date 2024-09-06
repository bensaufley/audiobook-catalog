/* eslint-disable react/jsx-no-useless-fragment */
import { Signal } from '@preact/signals';
import clsx from 'clsx';

import { chooseBestContrast } from '~client/shared/colors';
import { selectedBookId, tags } from '~client/signals/books';
import { removeTagFromBook } from '~client/signals/books/tagHelpers';
import X from '~icons/x.svg?react';

import { addingTag } from './TagPicker';

const removingTag = new Signal(false);
const Tags = () => (
  <>
    {addingTag.value ? (
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    ) : (
      tags.value
        ?.filter(({ AudiobookTags }) => AudiobookTags?.some(({ AudiobookId }) => AudiobookId === selectedBookId.value))
        .map(({ color, name }) => (
          <span
            key={name}
            class={clsx('badge me-1', removingTag.value && 'opacity-50')}
            style={{ backgroundColor: color, color: chooseBestContrast(color, '#000', '#fff') }}
          >
            <span>{name}</span>
            <button
              type="button"
              class="bg-transparent border-0 p-0"
              disabled={removingTag}
              onClick={async (e) => {
                e.preventDefault();
                removingTag.value = true;
                await removeTagFromBook(name, selectedBookId.value!);
                removingTag.value = false;
              }}
              aria-label={`Remove Tag: ${name}`}
              style={{ color: chooseBestContrast(color, '#000', '#fff') }}
            >
              <X />
            </button>
          </span>
        )) ?? <small>No tags yet</small>
    )}
  </>
);

export default Tags;
