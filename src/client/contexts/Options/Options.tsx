import type { JSX } from 'preact';
import { useCallback } from 'preact/hooks';
import { Button, Col, Form, NavDropdown, Row } from 'react-bootstrap';

import { useOptions } from '~client/contexts/Options';
import { Read, Size } from '~client/contexts/Options/enums';
import { SortBy, SortOrder } from '~client/contexts/Options/sort';
import { useUser } from '~client/contexts/User';
import useEvent from '~client/hooks/useEvent';

const Options = () => {
  const {
    changeFilter,
    changePage,
    changePerPage,
    changeRead,
    changeSize,
    changeSortBy,
    changeSortOrder,
    filter,
    page,
    pages,
    perPage,
    read,
    size,
    sortBy,
    sortOrder,
  } = useOptions();

  const { user } = useUser();

  const handleChangeSize: JSX.GenericEventHandler<HTMLInputElement> = useEvent((e) => {
    changeSize(Number(e.currentTarget.value) as Size);
  });

  const handleChangePage: JSX.GenericEventHandler<HTMLSelectElement> = useEvent(({ currentTarget: { value } }) => {
    changePage(() => Number(value));
  });

  const handleChangePerPage: JSX.GenericEventHandler<HTMLSelectElement> = useEvent(({ currentTarget: { value } }) => {
    changePerPage(parseInt(value, 10));
  });

  const handleChangeRead: JSX.GenericEventHandler<HTMLSelectElement> = useEvent(({ currentTarget: { value } }) => {
    changeRead(value as Read);
  });

  const handleSearch: JSX.GenericEventHandler<HTMLInputElement> = useEvent(({ currentTarget: { value } }) => {
    changeFilter(value);
  });

  const handleChangeSortBy: JSX.GenericEventHandler<HTMLSelectElement> = useEvent(({ currentTarget: { value } }) => {
    changeSortBy(SortBy[value as keyof typeof SortBy]);
  });

  const handleChangeSortOrder: JSX.GenericEventHandler<HTMLButtonElement> = useEvent((e) => {
    e.preventDefault();

    changeSortOrder((o) => (o === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending));
  });

  return (
    <NavDropdown title="Options">
      {user && (
        <NavDropdown.Item>
          <Form.Label htmlFor="read">Show</Form.Label>
          <Form.Select name="read" id="read" onChange={handleChangeRead}>
            {Object.entries(Read).map(([k, v]) => (
              <option value={k} selected={read === k}>
                {v}
              </option>
            ))}
          </Form.Select>
        </NavDropdown.Item>
      )}
      <NavDropdown.Item>
        <Form.Label for="sort-by">Sort By:</Form.Label>
        <Row>
          <Col xs="auto">
            <Form.Select name="sort-by" id="sort-by" onChange={handleChangeSortBy}>
              {Object.entries(SortBy).map(([k, v]) => (
                <option value={k} selected={sortBy === k}>
                  {v}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button type="button" onClick={handleChangeSortOrder}>
              {sortOrder === SortOrder.Ascending ? <>⌃</> : <>⌄</>}
            </Button>
          </Col>
        </Row>
      </NavDropdown.Item>
      <NavDropdown.Item>
        <Form.Label for="page">Page:</Form.Label>
        <Form.Select name="page" id="page" onChange={handleChangePage}>
          {[...new Array(pages)].map((_, i) => (
            <option value={i} selected={page === i}>
              {i + 1}
            </option>
          ))}
        </Form.Select>
      </NavDropdown.Item>
      <Form.Label for="per-page">Per Page:</Form.Label>
      <Form.Select name="per-page" id="per-page" onChange={handleChangePerPage}>
        {[...new Array(5)].map((_, i) => (
          <option value={(i + 1) * 20} selected={perPage === (i + 1) * 20}>
            {(i + 1) * 20}
          </option>
        ))}
      </Form.Select>
      <Form.Label for="size">Size:</Form.Label>
      <Form.Control
        type="range"
        id="size"
        name="size"
        min={Size.Small}
        max={Size.XLarge}
        value={size}
        onInput={handleChangeSize}
      />
      <Form.Label for="filter">Filter:</Form.Label>
      <Form.Control type="search" name="filter" id="filter" onInput={handleSearch} value={filter} />
    </NavDropdown>
  );
};

export default Options;
