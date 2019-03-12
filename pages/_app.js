import App from 'next/app';
import Head from 'next/head';
import React from 'react';

import '../assets/index.css';

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        return (
            <>
                <Head>
                    <title>solc.dev</title>
                </Head>
                <div className="container-fluid">
                    <Component {...pageProps} />
                </div>
            </>
        );
    }
}

export default MyApp;
