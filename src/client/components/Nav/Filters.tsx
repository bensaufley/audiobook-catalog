import { useSignal } from '@preact/signals';
import { clsx } from 'clsx';
import type { JSX } from 'preact';
import { useRef } from 'preact/hooks';

import { chooseBestContrast } from '~client/shared/colors';
import { bulkTag, tags, untaggedBooks } from '~client/signals/books';
import { deleteTag } from '~client/signals/books/tagHelpers';
import { filterByTag, filterByTagUnionType, search, UNTAGGED } from '~client/signals/options';
import Collection from '~icons/collection.svg?react';
import CollectionFill from '~icons/collection-fill.svg?react';
import Filter from '~icons/filter.svg?react';
import Plus from '~icons/plus.svg?react';
import QuestionLg from '~icons/question-lg.svg?react';
import X from '~icons/x.svg?react';

import useEscape from '../../hooks/useEscape';
import AddTag from '../AddTag';

const CollectionIcon = ({ name, ...rest }: { name: string } & JSX.SVGAttributes<SVGSVGElement>) => {
  const Icon = bulkTag.value === name ? CollectionFill : Collection;
  return <Icon className={rest.class} {...rest} />;
};

const Filters = () => {
  const ref = useRef<HTMLUListElement>(null);
  const open = useSignal(false);
  const showAddTag = useSignal(false);
  const addingTag = useSignal(false);

  useEscape(open, ref);

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
        ref={ref}
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
            {(!!filterByTag.value.length || !!bulkTag.value) && (
              <button
                type="button"
                class="btn border-0 bg-transparent ms-auto py-0 pe-0"
                onClick={(e) => {
                  e.preventDefault();
                  filterByTag.value = [];
                  bulkTag.value = undefined;
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
              disabled={filterByTag.value.includes(UNTAGGED)}
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
                'gap-2',
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
              <small class="ms-auto opacity-75">{AudiobookTags?.length ?? 0}</small>
              <CollectionIcon
                name={name}
                width="1rem"
                height="1rem"
                tabIndex={0}
                aria-label={`Bulk Tag: ${name}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  bulkTag.value = bulkTag.peek() === name ? undefined : name;
                }}
              />
              {AudiobookTags?.length === 0 && (
                <X
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
        <li>
          <button
            class={clsx(
              'dropdown-item',
              'd-flex',
              'align-items-center',
              'gap-2',
              filterByTag.value.includes(UNTAGGED) && 'active',
            )}
            onClick={(e) => {
              e.preventDefault();
              if (filterByTag.value.includes(UNTAGGED)) {
                filterByTag.value = filterByTag.peek().filter((v) => v !== UNTAGGED);
              } else {
                filterByTagUnionType.value = 'or';
                filterByTag.value = [...filterByTag.peek(), UNTAGGED];
              }
            }}
            type="button"
          >
            <div class="badge me-2 border border-secondary bg-transparent position-relative">
              &nbsp;
              <QuestionLg
                className="position-absolute top-0 bottom-0 start-0 end-0 w-auto h-auto"
                width="auto"
                height="auto"
              />
            </div>
            <span>Untagged</span>
            <small class="ms-auto opacity-75">{untaggedBooks.value.length}</small>
          </button>
        </li>
        <li class="dropdown-divider" />
        <li>
          <button
            class="dropdown-item"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              showAddTag.value = !showAddTag.peek();
            }}
          >
            <Plus /> Add Tag
          </button>
        </li>
        <AddTag disabled={addingTag} shown={showAddTag} />
      </ul>
    </li>
  );
};

export default Filters;
