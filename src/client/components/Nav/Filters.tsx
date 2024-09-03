import { useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';

import { chooseBestContrast } from '~client/shared/colors';
import { tags } from '~client/signals/books';
import { deleteTag } from '~client/signals/books/tagHelpers';
import { filterByTag, filterByTagUnionType, search } from '~client/signals/options';
import Filter from '~icons/filter.svg?react';
import X from '~icons/x.svg?react';

const Filters = () => {
  const open = useSignal(false);

  return (
    <li class="nav-item dropdown">
      <button
        type="button"
        class="nav-link dropdown-toggle d-flex align-items-center gap-2"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          open.value = !open.peek();
        }}
      >
        <Filter />
        <span>Filters</span>
      </button>
      <ul
        class={clsx('dropdown-menu', open.value && 'show')}
        style={{ minWidth: 'max-content', maxWidth: '100vw', right: 0 }}
      >
        <li class="px-3 py-2">
          <input
            class="form-control"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLInputElement>) => {
              search.value = value;
            }}
          />
        </li>
        <li>
          <h6 class="dropdown-header d-flex flex-flow-row align-items-center">
            <span>Tags</span>
            {!!filterByTag.value.length && (
              <button
                type="button"
                class="btn border-0 bg-transparent ms-auto py-0 pe-0"
                onClick={(e) => {
                  e.preventDefault();
                  filterByTag.value = [];
                }}
                aria-label="Clear"
                style={{ marginTop: '-0.25rem', marginBottom: '-0.25rem' }}
              >
                <X width="1.5rem" height="1.5rem" />
              </button>
            )}
          </h6>
        </li>
        <li class="pt-1 pb-2 px-3">
          <div class="btn-group col-12">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                filterByTagUnionType.value = 'or';
              }}
              class={clsx('btn', 'btn-sm', {
                'btn-primary': filterByTagUnionType.value === 'or' && filterByTag.value.length > 0,
                'btn-secondary': filterByTagUnionType.value === 'or' && filterByTag.value.length === 0,
                'btn-outline-primary': filterByTagUnionType.value !== 'or' && filterByTag.value.length > 0,
                'btn-outline-secondary': filterByTagUnionType.value !== 'or' && filterByTag.value.length === 0,
              })}
            >
              OR
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                filterByTagUnionType.value = 'and';
              }}
              class={clsx('btn', 'btn-sm', {
                'btn-primary': filterByTagUnionType.value === 'and' && filterByTag.value.length > 0,
                'btn-secondary': filterByTagUnionType.value === 'and' && filterByTag.value.length === 0,
                'btn-outline-primary': filterByTagUnionType.value !== 'and' && filterByTag.value.length > 0,
                'btn-outline-secondary': filterByTagUnionType.value !== 'and' && filterByTag.value.length === 0,
              })}
            >
              AND
            </button>
          </div>
        </li>
        {tags.value?.map(({ color, name, AudiobookTags }) => (
          <li key={name}>
            <button
              class={clsx(
                'dropdown-item',
                'd-flex',
                'align-items-center',
                filterByTag.value.includes(name) && 'active',
              )}
              style={
                filterByTag.value.includes(name)
                  ? { backgroundColor: color, color: chooseBestContrast(color, '#000', '#fff') }
                  : {}
              }
              onClick={(e) => {
                e.preventDefault();
                filterByTag.value = filterByTag.peek().includes(name)
                  ? filterByTag.peek().filter((v) => v !== name)
                  : [...filterByTag.peek(), name];
              }}
              type="button"
            >
              <div
                class="badge me-2 border-0"
                style={
                  filterByTag.value.includes(name) ? { backgroundColor: 'currentColor' } : { backgroundColor: color }
                }
              >
                &nbsp;
              </div>
              <span>{name}</span>
              {true /* AudiobookTags?.length === 0 */ && (
                <X
                  className="ms-auto"
                  width="1.5rem"
                  height="1.5rem"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      // eslint-disable-next-line no-alert
                      window.confirm(`Are you sure you want to delete the tag "${name}"? This action cannot be undone.`)
                    ) {
                      deleteTag(name);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`Delete Tag: ${name}`}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};

export default Filters;
