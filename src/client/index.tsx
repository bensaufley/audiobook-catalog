if (process.env.APP_ENV === 'development') {
  require('preact/debug');
}

import { h, render } from 'preact';

import App from '~client/components/App';

render(<App />, document.getElementById('root')!);

if (module.hot) {
  module.hot.accept();
}
