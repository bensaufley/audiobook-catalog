import { useComputed } from '@preact/signals';
import type { JSX } from 'preact';
import { Col, Form, Row } from 'react-bootstrap';
import BsPagination from 'react-bootstrap/Pagination';

import { page, pages, perPage } from '~client/signals/Options';

const GROUP_SIZE = 5;

const Pagination = () => {
  const groups = useComputed((): [number[]] | [number[], number[], number[]] => {
    if (pages.value <= GROUP_SIZE * 2) return [Array.from({ length: pages.value }, (_, i) => i)];
    const allPages = Array.from({ length: pages.value }, (_, i) => i);
    const startGroup = allPages.slice(0, GROUP_SIZE);
    const endGroup = allPages.slice(-GROUP_SIZE);
    const midGroup = allPages
      .slice(page.value - Math.floor(GROUP_SIZE / 2), page.value + Math.ceil(GROUP_SIZE / 2))
      .filter((p) => !startGroup.includes(p) && !endGroup.includes(p));
    return [startGroup, midGroup, endGroup];
  });

  return (
    <div class="d-flex justify-content-center gap-4 my-4">
      <Form>
        <Row>
          <Form.Label column htmlFor="per-page">
            Per Page
          </Form.Label>
          <Col>
            <Form.Select
              name="per-page"
              id="per-page"
              onChange={({ currentTarget: { value } }: JSX.TargetedInputEvent<HTMLSelectElement>) => {
                perPage.value = Number(value);
              }}
            >
              <optgroup label="Per Page">
                {[...new Array(5)].map((_, i) => (
                  <option value={(i + 1) * 20} selected={perPage.value === (i + 1) * 20}>
                    {(i + 1) * 20}
                  </option>
                ))}
              </optgroup>
            </Form.Select>
          </Col>
        </Row>
      </Form>
      <BsPagination>
        <BsPagination.Prev
          onClick={() => {
            page.value -= 1;
          }}
          disabled={page.value === 0}
        />
        {groups.value[0].map((p) => (
          <BsPagination.Item
            onClick={() => {
              page.value = p;
            }}
            active={p === page.value}
          >
            {p + 1}
          </BsPagination.Item>
        ))}
        {groups.value[1] && groups.value[0].at(-1) !== groups.value[1].at(0) && <BsPagination.Ellipsis disabled />}
        {groups.value[1]?.map((p) => (
          <BsPagination.Item
            onClick={() => {
              page.value = p;
            }}
            active={p === page.value}
          >
            {p + 1}
          </BsPagination.Item>
        ))}
        {groups.value[2] && groups.value[1]!.at(-1) !== groups.value[2].at(0) && <BsPagination.Ellipsis disabled />}
        {groups.value[2]?.map((p) => (
          <BsPagination.Item
            onClick={() => {
              page.value = p;
            }}
            active={p === page.value}
          >
            {p + 1}
          </BsPagination.Item>
        ))}
        <BsPagination.Next
          onClick={() => {
            page.value += 1;
          }}
          disabled={page.value === pages.value - 1}
        />
      </BsPagination>
    </div>
  );
};

export default Pagination;
