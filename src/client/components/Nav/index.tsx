import { useSignal } from '@preact/signals';
import type { JSX } from 'preact';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import BootstrapNav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import UserManagement from '~client/components/UserManagement';
import { search, size, sortBy, sortOrder } from '~client/signals/Options';
import { Size } from '~client/signals/Options/enums';
import { SortBy, SortOrder } from '~client/signals/Options/sort';
import SortDown from '~icons/sort-down.svg?react';
import SortUp from '~icons/sort-up.svg?react';

const Nav = () => {
  const show = useSignal(false);

  return (
    <Navbar expand="xl" sticky="top" className="bg-body-tertiary">
      <Container fluid="xl">
        <Navbar.Brand className="me-6 my-0">Audiobook Catalog</Navbar.Brand>
        <Navbar.Toggle
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => {
            show.value = !show.peek();
          }}
        />
        <Navbar.Collapse show={show.value} className="flex-xl-grow-0">
          <BootstrapNav>
            <Form
              onSubmit={(e: JSX.TargetedSubmitEvent<HTMLFormElement>) => {
                e.preventDefault();
              }}
            >
              <Row>
                <Col xs={12} xl="auto" className="my-2 my-xl-0">
                  <Form.Control
                    id="search"
                    type="search"
                    placeholder="Search"
                    onChange={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLInputElement>) => {
                      search.value = value;
                    }}
                  />
                </Col>
                <Col xs={12} xl="auto" className="my-2 my-xl-0">
                  <Row>
                    <Form.Label column htmlFor="sort-by">
                      Sort By:
                    </Form.Label>
                    <Col xs="auto">
                      <InputGroup>
                        <Form.Select
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
                        </Form.Select>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={(e: Event) => {
                            e.preventDefault();
                            sortOrder.value = ((o) =>
                              o === SortOrder.Ascending ? SortOrder.Descending : SortOrder.Ascending)(sortOrder.peek());
                          }}
                        >
                          {sortOrder.value === SortOrder.Ascending ? <SortDown /> : <SortUp />}
                        </Button>
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col xs={12} xl="auto" className="my-2 my-xl-0 d-flex">
                  <Form.Range
                    id="size"
                    name="size"
                    className="align-self-center"
                    min={Size.Small}
                    max={Size.XLarge}
                    value={size}
                    onInput={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLInputElement>) => {
                      size.value = Number(value) as Size;
                    }}
                  />
                </Col>
              </Row>
            </Form>
            <UserManagement />
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Nav;
