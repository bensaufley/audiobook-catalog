import { ObjectIDMock } from 'graphql-scalars';
import { h } from 'preact';
import { fromValue } from 'wonka';

import Home from '~client/components/Home';
import { GetAudiobooksQuery } from '~client/components/Home/getAudiobooks';
import { mockClient, renderWithProviders } from '~spec/support/spec-helpers';

describe('~client/components/Home', () => {
  it('renders without exploding', () => {
    const stubbedQueryResult: GetAudiobooksQuery = {
      getAudiobooks: [
        {
          id: ObjectIDMock(),
          cover: 'data:image/jpeg;base64,faoiweurpoaewurpoiaewupornawepiofweiohnoipewaf',
          name: 'Ghost in the Wires',
          year: 2011,
          genres: [],
          authors: [
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Mitnick',
                firstName: 'Kevin',
              },
              meta: null,
            },
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Simon',
                firstName: 'William L.',
              },
              meta: null,
            },
          ],
        },
        {
          id: ObjectIDMock(),
          cover: null,
          name: 'The Echo Wife',
          year: 2021,
          genres: [],
          authors: [
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Gailey',
                firstName: 'Sarah',
              },
              meta: null,
            },
          ],
        },
        {
          id: ObjectIDMock(),
          cover: null,
          name: 'The Theory of Everything: The Quest to Explain All Reality',
          year: 2018,
          genres: [],
          authors: [
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Lincoln',
                firstName: 'Don',
              },
              meta: null,
            },
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Courses',
                firstName: 'The Great',
              },
              meta: null,
            },
          ],
        },
        {
          id: ObjectIDMock(),
          cover: null,
          name: 'Vagabonds',
          year: 2020,
          genres: [],
          authors: [
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Jingfang',
                firstName: 'Hao',
              },
              meta: null,
            },
            {
              id: ObjectIDMock(),
              author: {
                lastName: 'Liu',
                firstName: 'Ken',
              },
              meta: 'translator',
            },
          ],
        },
      ],
    };
    const { container } = renderWithProviders({
      client: mockClient({
        executeQuery: jest.fn(() =>
          fromValue({
            data: stubbedQueryResult,
          }),
        ) as any,
      }),
    })(<Home />);

    expect(container).toMatchSnapshot();
  });
});
