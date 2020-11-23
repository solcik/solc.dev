import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';

import '../css/global.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="keywords" content="" />
        <title>solc.dev</title>
      </Head>
      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
}
