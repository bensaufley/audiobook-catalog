/* eslint-disable react/jsx-props-no-spreading */
import { render } from '@testing-library/preact';
import { ObjectIDMock } from 'graphql-scalars';
import { h } from 'preact';

import Audiobook from '~client/components/Audiobook';
import { AudiobookFragment } from '~client/components/Home/getAudiobooks';
import theEchoWifeJSON from '~spec/__mocks__/data/[metadata] The Echo Wife.json';

describe('~client/components/Audiobook', () => {
  it('renders without exploding', () => {
    const audiobook: AudiobookFragment = {
      id: 'asdifpowaerew',
      duration: 32123141,
      filepath: 'the-power.m4b',
      name: 'The Power',
      year: 2017,
      genres: [],
      authors: [
        {
          id: 'aweirupawoeruewr',
          meta: null,
          author: { firstName: 'Naomi', lastName: 'Alderman' },
        },
      ],
    };

    const { container } = render(<Audiobook {...audiobook} />);

    expect(container).toMatchSnapshot();
  });

  it('renders real data without exploding', () => {
    const audiobook: AudiobookFragment = {
      id: ObjectIDMock(),
      duration: 2321432,
      filepath: 'the-echo-wife.m4b',
      name: theEchoWifeJSON.common.title,
      year: theEchoWifeJSON.common.year,
      genres: [{ name: 'fiction' }, { name: 'science fiction' }],
      authors: [
        {
          id: ObjectIDMock(),
          meta: null,
          author: { firstName: 'Naomi', lastName: 'Alderman' },
        },
      ],
    };

    const { container } = render(<Audiobook {...audiobook} />);

    expect(container).toMatchSnapshot();
  });
});
