import { useComputed } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';

import { page, pages, perPage, perPageOptions } from '~client/signals/Options';
import ChevronDoubleLeft from '~icons/chevron-double-left.svg?react';
import ChevronDoubleRight from '~icons/chevron-double-right.svg?react';
import ChevronLeft from '~icons/chevron-left.svg?react';
import ChevronRight from '~icons/chevron-right.svg?react';

const GROUP_SIZE = 5;

const Pagination = () => {
  const group = useComputed(() => {
    const start = Math.max(0, page.value - Math.floor(GROUP_SIZE / 2));
    const end = Math.min(pages.value, start + GROUP_SIZE);
    return Array.from({ length: end - start }, (_, i) => i + start);
  });

  return (
    <div class="row justify-content-center gap-4 my-4">
      <form class="col-12 col-md-auto d-flex justify-content-center justify-content-md-start order-1 order-md-0">
        <div class="row">
          <label class="col form-label col-form-label" for="per-page">
            Per Page
          </label>
          <div class="col">
            <select
              class="form-select"
              name="per-page"
              id="per-page"
              onChange={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLSelectElement>) => {
                perPage.value = Number(value);
              }}
            >
              <optgroup label="Per Page">
                {perPageOptions.value.map((n) => (
                  <option value={n} selected={perPage.value === n}>
                    {n}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </form>
      <nav class="col-12 col-md-auto d-flex justify-content-center justify-content-md-start order-0 order-md-1">
        <ul class="pagination">
          <li class="page-item">
            <button
              type="button"
              onClick={() => {
                page.value = 0;
              }}
              disabled={page.value === 0}
              class={clsx('page-link', page.value === 0 && 'disabled')}
              aria-label="First Page"
            >
              <ChevronDoubleLeft />
            </button>
          </li>
          <li class="page-item">
            <button
              type="button"
              onClick={() => {
                page.value -= 1;
              }}
              disabled={page.value === 0}
              class={clsx('page-link', page.value === 0 && 'disabled')}
              aria-label="Previous Page"
            >
              <ChevronLeft />
            </button>
          </li>
          {group.value.map((p) => (
            <li class="page-item">
              <button
                type="button"
                class={clsx('page-link', p === page.value && 'active')}
                onClick={() => {
                  page.value = p;
                }}
              >
                {p + 1}
              </button>
            </li>
          ))}
          <li class="page-item">
            <button
              type="button"
              onClick={() => {
                page.value += 1;
              }}
              disabled={page.value === pages.value - 1}
              class={clsx('page-link', page.value === pages.value - 1 && 'disabled')}
              aria-label="Next Page"
            >
              <ChevronRight />
            </button>
          </li>
          <li class="page-item">
            <button
              type="button"
              onClick={() => {
                page.value = pages.value - 1;
              }}
              disabled={page.value === pages.value - 1}
              class={clsx('page-link', page.value === pages.value - 1 && 'disabled')}
              aria-label="Last Page"
            >
              <ChevronDoubleRight />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
