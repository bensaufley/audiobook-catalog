import { Fragment, FunctionComponent, h } from 'preact';
import { useMemo } from 'preact/hooks';

import styles from '~client/components/Audiobook/styles.modules.css';
import { AudiobookFragment } from '~client/components/Home/getAudiobooks.generated';

const Audiobook: FunctionComponent<AudiobookFragment> = ({
  id,
  name,
  duration,
  filename,
  authors,
  year,
}) => {
  const formattedDuration = useMemo(() => {
    const seconds = Math.ceil(duration % 60);
    const minutes = Math.floor(duration / 60) % 60;
    const hours = Math.floor(duration / 3600);
    return `${hours}:${`0${minutes}`.substr(-2)}:${`0${seconds}`.substr(-2)}`;
  }, [duration]);
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div class={styles.audiobook} style={{ backgroundImage: `url(/cover/${id})` }} tabIndex={0}>
      {/* {cover && <img src={cover} alt={name} />} */}
      <div class={styles.contents}>
        <h3>
          <strong>{name}</strong>
          {year && ` (${year})`}
        </h3>
        <p>
          {formattedDuration}
          <br />
          by{' '}
          {authors.map(({ author: { firstName, lastName }, meta }, i) => (
            <>
              {i > 0 && ', '}
              {firstName} {lastName}
              {meta && ` (${meta})`}
            </>
          ))}
        </p>
        <a class={styles.downloadButton} href={`/downloads/${filename}`}>
          Download
        </a>
      </div>
    </div>
  );
};

export default Audiobook;
