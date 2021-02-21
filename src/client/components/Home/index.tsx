import { FunctionComponent, h } from 'preact';

import Audiobook from '~client/components/Audiobook';
import { useGetAudiobooksQuery } from '~client/components/Home/getAudiobooks';

const Home: FunctionComponent = () => {
  const [
    { data: { getAudiobooks: audiobooks } = { getAudiobooks: [] }, error },
  ] = useGetAudiobooksQuery();

  return (
    <div>
      <h1>Audiobook Catalog</h1>
      {error && <p>{error}</p>}
      {audiobooks.map((audiobook) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Audiobook {...audiobook} />
      ))}
    </div>
  );
};

export default Home;
