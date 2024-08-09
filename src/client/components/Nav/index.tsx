import { useSignal } from '@preact/signals';
import clsx from 'clsx';
import type { JSX } from 'preact';

import UserManagement from '~client/components/UserManagement';
import { search, size, sortBy, sortOrder } from '~client/signals/Options';
import { Size } from '~client/signals/Options/enums';
import { SortBy, SortOrder } from '~client/signals/Options/sort';
import List from '~icons/list.svg?react';
import SortDown from '~icons/sort-down.svg?react';
import SortUp from '~icons/sort-up.svg?react';

const Nav = () => {
  const show = useSignal(false);

  return (
    <div class="navbar navbar-expand-xl sticky-top bg-body-tertiary shadow">
      <div class="container-xl">
        <h2 class="navbar-brand me-6 my-0">Audiobook Catalog</h2>
        <button
          class="navbar-toggler"
          type="button"
          aria-expanded={show}
          aria-label="Toggle navigation"
          onClick={() => {
            show.value = !show.peek();
          }}
        >
          <List />
        </button>
        <div class={clsx('collapse', 'navbar-collapse', show.value && 'show', 'flex-xl-grow-0')}>
          <div class="navbar-nav">
            <form
              onSubmit={(e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
                e.preventDefault();
              }}
            >
              <div class="row">
                <div class="my-2 my-xl-0 col-xl-auto col-12">
                  <input
                    class="form-control"
                    id="search"
                    type="search"
                    placeholder="Search"
                    onChange={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLInputElement>) => {
                      search.value = value;
                    }}
                  />
                </div>
                <div class="my-2 my-xl-0 col-xl-auto col-12">
                  <div class="row">
                    <div class="form-label col-form-label col" for="sort-by">
                      Sort By:
                    </div>
                    <div class="col-auto">
                      <div class="input-group">
                        <select
                          class="form-select"
                          name="sort-by"
                          id="sort-by"
                          onChange={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLSelectElement>) => {
                            sortBy.value = value as SortBy;
                          }}
                        >
                          <optgroup label="Sort By">
                            {Object.entries(SortBy).map(([k, v]) => (
                              <option value={k} selected={sortBy.value === k}>
                                {v}
                              </option>
                            ))}
                          </optgroup>
                        </select>
                        <button
                          type="button"
                          class="btn btn-secondary"
                          onClick={(e: Event) => {
                            e.preventDefault();
                            sortOrder.value = ((o) =>
                              o === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending)(sortOrder.peek());
                          }}
                        >
                          {sortOrder.value === SortOrder.Ascending ? <SortDown /> : <SortUp />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="my-2 my-xl-0 col-xl-auto col-12 d-flex">
                  <input
                    type="range"
                    id="size"
                    name="size"
                    class="form-range align-self-center"
                    min={Size.Small}
                    max={Size.XLarge}
                    value={size}
                    onInput={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLInputElement>) => {
                      size.value = Number(value) as Size;
                    }}
                  />
                </div>
              </div>
            </form>
            <UserManagement />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
