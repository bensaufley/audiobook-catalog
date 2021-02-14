import { FunctionComponent, h } from 'preact';

import { useGetAudiobooksQuery } from '~client/components/App/getAudiobooks';

const Home: FunctionComponent = () => {
  const [
    { data: { getAudiobooks: audioBooks } = { getAudiobooks: [] }, error },
  ] = useGetAudiobooksQuery();

  return (
    <div>
      <h1>Audiobook Catalog</h1>
      <pre>{JSON.stringify(error ? error.toString() : audioBooks, null, 2)}</pre>
    </div>
  );
};

export default Home;
