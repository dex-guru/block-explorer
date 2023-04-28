import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/icon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/icon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/icon/favicon-16x16.png"
        />
        <link rel="manifest" href="/assets/icon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/assets/icon/safari-pinned-tab.svg"
          color="#05fc99"
        />
        <link rel="shortcut icon" href="/assets/icon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#1e242c" />
        <meta
          name="msapplication-config"
          content="/assets/icon/browserconfig.xml"
        />
        <meta name="theme-color" content="#1e242c" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
