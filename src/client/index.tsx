import { h, render } from 'preact';

render(<h1>Hello, World!</h1>, document.getElementById('root')!);

if (module.hot) {
  module.hot.accept();
}
