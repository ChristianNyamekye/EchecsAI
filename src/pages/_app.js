import "../../styles/globals.css";
import "@mantine/core/styles.css";

import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider 
      theme={{
        fontFamily: 'Times New Roman',
        fontFamilyMonospace: 'Monaco, Courier, monospace',
        headings: { fontFamily: 'Greycliff CF, sans-serif' },
      }}
    >
      {/* <Head>
        <link rel="icon" href="public/images/favicon.png" />
      </Head> */}
      <Notifications />
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default MyApp;
