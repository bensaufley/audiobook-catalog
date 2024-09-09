import { Signal, useSignal, useSignalEffect } from '@preact/signals';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';

import useEscape from '~client/hooks/useEscape';
import useEvent from '~client/hooks/useEvent';
import { chooseBestContrast } from '~client/shared/colors';
import { selectedBookId, tags } from '~client/signals/books';
import { addTagToBook, makeTag } from '~client/signals/books/tagHelpers';
import ArrowClockwise from '~icons/arrow-clockwise.svg?react';
import Plus from '~icons/plus.svg?react';

export const addingTag = new Signal(false);

const randomHexColor = (): `#${string}` =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

const TagPicker = () => {
  const showAddTagDropdown = useSignal(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEscape(showAddTagDropdown, dropdownRef);

  const newTagBackgroundColor = useSignal(randomHexColor());
  const newTagName = useSignal('');

  useSignalEffect(() => {
    if (!newTagBackgroundColor.value) return;
    if (!newTagBackgroundColor.value.startsWith('#')) newTagBackgroundColor.value = `#${newTagBackgroundColor.peek()}`;
  });

  const addTag = useEvent(async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === false) return;

    addingTag.value = true;
    if (!(await makeTag(newTagName.value, newTagBackgroundColor.value, selectedBookId.value!))) return;
    addingTag.value = false;

    showAddTagDropdown.value = false;
    newTagName.value = '';
    newTagBackgroundColor.value = randomHexColor();
  });

  return (
    <div class="btn-group ms-auto">
      <button
        onClick={(e) => {
          e.preventDefault();
          showAddTagDropdown.value = !showAddTagDropdown.value;
        }}
        type="button"
        class="btn bg-transparent border-0 text-body dropdown-toggle"
      >
        Add Tag
      </button>
      <ul
        class={clsx('dropdown-menu', showAddTagDropdown.value && 'show')}
        style={{ width: '25rem', maxWidth: '100vw', top: '100%' }}
        ref={dropdownRef}
      >
        <li>
          <h6 class="dropdown-header">Add Tag</h6>
        </li>
        <li class="d-flex flex-wrap flex-flow-row gap-2 px-3 py-2">
          {tags.value
            ?.toSorted()
            .filter(
              ({ AudiobookTags }) => !AudiobookTags?.some(({ AudiobookId }) => AudiobookId === selectedBookId.value),
            )
            .map(({ color, name }) => (
              <button
                key={name}
                disabled={addingTag}
                type="button"
                class="badge me-1 border-0"
                onClick={async (e) => {
                  e.preventDefault();
                  addingTag.value = true;
                  if (!(await addTagToBook(name, selectedBookId.value!))) return;
                  addingTag.value = false;

                  showAddTagDropdown.value = false;
                  newTagName.value = '';
                  newTagBackgroundColor.value = randomHexColor();
                }}
                style={{
                  backgroundColor: color,
                  color: chooseBestContrast(color, '#000', '#fff'),
                }}
              >
                {name}
              </button>
            )) ?? <span>No tags created yet</span>}
        </li>
        {!!tags.value?.filter(
          ({ AudiobookTags }) => !AudiobookTags?.some(({ AudiobookId }) => AudiobookId === selectedBookId.value),
        ).length && <li class="dropdown-divider" />}
        <li>
          <form class="input-group px-3 py-2" onSubmit={addTag} disabled={addingTag}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                newTagBackgroundColor.value = randomHexColor();
              }}
              class="input-group-text"
              style={{
                backgroundColor: newTagBackgroundColor.value,
                color: chooseBestContrast(newTagBackgroundColor.value, '#000', '#fff'),
              }}
              aria-label="New Tag Color"
              disabled={addingTag}
            >
              <ArrowClockwise />
            </button>
            <input
              type="text"
              class="form-control flex-shrink-0 flex-grow-0"
              placeholder="Color"
              value={newTagBackgroundColor}
              onInput={(e) => {
                newTagBackgroundColor.value = e.currentTarget.value as `#${string}`;
              }}
              required
              pattern="#[0-9a-fA-F]{6}"
              style={{ width: '6rem' }}
              disabled={addingTag}
            />
            <input
              type="text"
              class="form-control"
              placeholder="Tag Name"
              pattern=".{2,}"
              required
              value={newTagName}
              onInput={(e) => {
                newTagName.value = e.currentTarget.value;
              }}
              disabled={addingTag}
            />
            <button disabled={addingTag} type="submit" class="btn btn-primary" aria-label="Add Tag">
              <Plus />
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
};

export default TagPicker;
