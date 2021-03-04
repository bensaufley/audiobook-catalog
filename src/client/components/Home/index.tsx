import { FunctionComponent, h } from 'preact';
import { useMemo } from 'preact/hooks';

import Audiobook from '~client/components/Audiobook';
import { useGetAudiobooksQuery } from '~client/components/Home/getAudiobooks.generated';
import styles from '~client/components/Home/home.modules.css';

const Home: FunctionComponent = () => {
  const [{ data, error }] = useGetAudiobooksQuery();
  const audiobooks = useMemo(() => {
    if (error || !data) return null;
    return data.getAudiobooks;
  }, [data, error]);

  return (
    <div>
      {error && <p title={JSON.stringify(error, null, 2)}>{error.message}</p>}
      <div class={styles['audiobook-container']}>
        {audiobooks &&
          audiobooks.map((audiobook) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Audiobook {...audiobook} />
          ))}
      </div>
    </div>
  );
};

export default Home;
