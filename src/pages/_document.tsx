import { useContext } from 'react'
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import { ChainConfigContext } from '@/providers/ChainConfigProvider/ChainConfigContext'

export default function Document() {
  const chainConfig = useContext(ChainConfigContext)

  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content={chainConfig?.chainColor} />

        {!!process.env.gTagManagerId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.gTagManagerId}');`}
          </Script>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />

        {!!process.env.gTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.gTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
      </body>
    </Html>
  )
}
