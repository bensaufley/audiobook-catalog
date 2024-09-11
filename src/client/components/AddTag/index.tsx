/* eslint-disable no-param-reassign */
import { type Signal, useSignal, useSignalEffect } from '@preact/signals';
import type { JSX } from 'preact';

import { chooseBestContrast } from '~client/shared/colors';
import { selectedBookId } from '~client/signals/books';
import { makeTag } from '~client/signals/books/tagHelpers';
import ArrowClockwise from '~icons/arrow-clockwise.svg?react';
import Plus from '~icons/plus.svg?react';

import useEvent from '../../hooks/useEvent';

const randomHexColor = (): `#${string}` =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;

const AddTag = ({
  class: className,
  disabled,
  shown,
}: {
  class?: string;
  disabled: Signal<boolean>;
  shown: Signal<boolean>;
}) => {
  const newTagName = useSignal('');
  const newTagBackgroundColor = useSignal(randomHexColor());

  useSignalEffect(() => {
    if (!newTagBackgroundColor.value) return;
    if (!newTagBackgroundColor.value.startsWith('#')) newTagBackgroundColor.value = `#${newTagBackgroundColor.peek()}`;
  });

  useSignalEffect(() => {
    if (shown.value) return;
    newTagName.value = '';
    newTagBackgroundColor.value = randomHexColor();
  });

  const addTag = useEvent(async (e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity() === false) return;

    disabled.value = true;
    if (!(await makeTag(newTagName.value, newTagBackgroundColor.value, selectedBookId.value!))) return;
    disabled.value = false;

    shown.value = false;
    newTagName.value = '';
    newTagBackgroundColor.value = randomHexColor();
  });

  if (!shown.value) return null;

  return (
    <li class={className}>
      <form class="input-group px-3 py-2" onSubmit={addTag} disabled={disabled}>
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
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled}
          style={{ width: '5rem' }}
        />
        <button disabled={disabled} type="submit" class="btn btn-primary" aria-label="Add Tag">
          <Plus />
        </button>
      </form>
    </li>
  );
};

export default AddTag;
