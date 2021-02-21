import { Fragment, FunctionComponent, h } from 'preact';

import { AudiobookFragment } from '~client/components/Home/getAudiobooks';

const Audiobook: FunctionComponent<AudiobookFragment> = ({ name, cover, authors, year }) => (
  <div>
    {cover && <img src={cover} alt={name} />}
    <p>{name}</p>
    <p>
      by{' '}
      {authors.map(({ author: { firstName, lastName }, meta }, i) => (
        <>
          {i > 0 && ', '}
          {firstName} {lastName}
          {meta && ` (${meta})`}
        </>
      ))}
    </p>
    <p>{year}</p>
  </div>
);

export default Audiobook;
