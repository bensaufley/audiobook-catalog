export enum BookStatus {
  Unread,
  Reading,
  Read,
}

export interface Book {
  title: string;
  author: Author;
  cover: BinaryType;
  status: BookStatus;
  tags: string[];
}

export interface Author {
  firstName: string;
  lastName: string;
}
