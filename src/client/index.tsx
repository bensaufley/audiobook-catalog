import { render } from 'preact';

import App from '~client/components/App';
import { refreshUsers } from '~client/signals/User';

import configureBootstrapTheme from './configureBootstrapTheme';

configureBootstrapTheme();
refreshUsers();

render(<App />, document.getElementById('root')!);
