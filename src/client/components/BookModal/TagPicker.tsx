import { Signal, useSignal } from '@preact/signals';
import { clsx } from 'clsx';
import { useRef } from 'preact/hooks';

import AddTag from '~client/components/AddTag';
import useEscape from '~client/hooks/useEscape';

import { chooseBestContrast } from '../../shared/colors';
import { selectedBookId, tags } from '../../signals/books';
import { addTagToBook } from '../../signals/books/tagHelpers';

export const addingTag = new Signal(false);

const TagPicker = () => {
  const showAddTagDropdown = useSignal(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEscape(showAddTagDropdown, dropdownRef);

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
        class={clsx('dropdown-menu', 'dropdown-menu-end', showAddTagDropdown.value && 'show')}
        style={{ width: '25rem', maxWidth: '100vw', right: 0, top: '100%' }}
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
        <AddTag disabled={addingTag} shown={showAddTagDropdown} />
      </ul>
    </div>
  );
};

export default TagPicker;
