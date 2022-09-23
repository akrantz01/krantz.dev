import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en">
    <Head>
      <link rel="icon" type="image/png" href="/favicon.ico" />
    </Head>
    <body className="antialiased font-inter bg-gray-50 text-gray-500 dark:bg-gray-900 selection:(bg-gray-900 dark:bg-white text-white dark:text-primary-500)">
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
