import { ObjectIDMock } from 'graphql-scalars';
import { h } from 'preact';
import { fromValue } from 'wonka';

import Home from '~client/components/Home';
import { GetAudiobooksQuery } from '~client/components/Home/getAudiobooks.generated';
import { mockClient, renderWithProviders } from '~spec/support/spec-helpers';

describe('~client/components/Home', () => {
  it('renders without exploding', () => {
    const stubbedQueryResult: GetAudiobooksQuery = {
      getAudiobooks: [
        {
          id: ObjectIDMock(),
          duration: 50358.02,
          filename: 'ghost-in-the-wirest-kevin-mitnick-william-l-simon.m4a',
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
          duration: 30372.560291666665,
          filename: 'the-echo-wife-sarah-gailey.m4b',
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
          duration: 44526.333333333336,
          filename:
            'the-theory-of-everything-the-quest-to-explain-all-reality-don-lincoln-the-great-courses.m4a',
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
          duration: 0,
          filename: 'vagabonds-hao-jingfang-ken-liu-translator.m4a',
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
