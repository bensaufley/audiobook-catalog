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
      name: 'The Power',
      year: 2017,
      cover: null,
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
    const cover = theEchoWifeJSON.native.iTunes.find((x) => x.id === 'covr');
    if (!cover) throw new Error('covr data missing in test data');
    const { value: coverValue } = cover;
    if (typeof coverValue === 'string') throw new Error('unexpected cover value type');
    const { data: coverData } = coverValue;
    const coverStr = `data:${coverData.type};base64,${Buffer.from(coverData.data).toString(
      'base64',
    )}`;
    const audiobook: AudiobookFragment = {
      id: ObjectIDMock(),
      name: theEchoWifeJSON.common.title,
      year: theEchoWifeJSON.common.year,
      cover: coverStr,
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
