import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';

import { Theme } from '@/types';

import 'inter-ui/inter.css';
// eslint-disable-next-line import/no-unresolved
import 'windi.css';

const App = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider attribute="class" defaultTheme={Theme.SYSTEM} themes={Object.values(Theme)}>
    <Component {...pageProps} />
  </ThemeProvider>
);

export default App;
