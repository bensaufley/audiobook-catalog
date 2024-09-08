import type { ComponentType } from 'preact';

import { bulkTag } from '~client/signals/books';
import { showUpNext } from '~client/signals/options';

import DraggableBook from './DraggableBook';
import StandardBook from './StandardBook';
import TaggableBook from './TaggableBook';

interface Props {
  bookId: string;
}

const Book = ({ bookId }: Props) => {
  let Component: ComponentType<Props>;
  if (showUpNext.value) {
    Component = DraggableBook;
  } else if (bulkTag.value) {
    Component = TaggableBook;
  } else {
    Component = StandardBook;
  }

  // TODO: remove extra divs once I figure out a better way around the insertBefore issue
  return (
    <div>
      <Component bookId={bookId} />
    </div>
  );
};

export default Book;
