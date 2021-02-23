/* eslint-disable import/first */
if (process.env.NODE_ENV === 'development') {
  /* eslint-disable global-require */
  require('preact/debug');
  require('preact/devtools');
  /* eslint-enable global-require */
}

import 'core-js/stable';
import 'whatwg-fetch';

import { h, render } from 'preact';

import App from '~client/components/App';

render(<App />, document.getElementById('root')!);

if (module.hot) {
  module.hot.accept();
}
