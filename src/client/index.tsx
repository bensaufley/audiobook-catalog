import { render } from 'preact';

import App from '~client/components/App';
import { refreshUsers } from '~client/signals/User';

import configureTheme from './configureTheme';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface FunctionComponent<P = {}> {
    (props: PropsWithChildren<P>, context?: any): ReactNode;
    displayName?: string;
    defaultProps?: Partial<P> | undefined;
  }

  type ElementType = keyof JSX.IntrinsicElements | ComponentType<any>;
  type ImgHTMLAttributes<T extends EventTarget = EventTarget> = JSX.HTMLAttributes<T>;
}

configureTheme();
refreshUsers();

render(<App />, document.getElementById('root')!);
