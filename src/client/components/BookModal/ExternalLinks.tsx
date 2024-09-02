import { useComputed } from '@preact/signals';

import { selectedBook } from '~client/signals/books';
import External from '~icons/box-arrow-up-right.svg?react';

const ExternalLinks = () => {
  const searchParam = useComputed(
    () =>
      `${encodeURIComponent(selectedBook.value?.title ?? '')} ${
        selectedBook.value?.Authors?.map(({ firstName = '', lastName }) => `${firstName} ${lastName}`) || ''
      }`,
  );

  return (
    <>
      <a
        class="btn btn-sm btn-outline-primary"
        href={`https://app.thestorygraph.com/browse?search_term=${searchParam}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="d-flex gap-2 align-items-center">
          <span class="flex-grow-1">The StoryGraph</span>
          <span class="mb-1">
            <External />
          </span>
        </span>
      </a>
      <a
        class="btn btn-sm btn-outline-primary"
        href={`https://www.librarything.com/search.php?searchtype=101&searchtype=101&sortchoice=0&search=${searchParam}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="d-flex gap-2 align-items-center">
          <span class="flex-grow-1">LibraryThing</span>
          <span class="mb-1">
            <External />
          </span>
        </span>
      </a>
      <a
        class="btn btn-sm btn-outline-primary"
        href={`https://hardcover.app/search?q=${searchParam}&type=Books`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="d-flex gap-2 align-items-center">
          <span class="flex-grow-1">Hardcover</span>
          <span class="mb-1">
            <External />
          </span>
        </span>
      </a>
    </>
  );
};

export default ExternalLinks;
