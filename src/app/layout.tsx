import { Metadata } from 'next'
import Script from 'next/script'
import ContextWrapper from './ContextWrapper'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { ApolloWrapper } from '@/lib/apollo/apolloWrapper'
import { initApm } from '@/services/apmService'
import '@/styles/index.scss'

export const metadata: Metadata = {
  themeColor: '#1e242c',
}

initApm()

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const chainConfig = await getChainConfig()
  return (
    <html lang="en">
      <head>
        {!!process.env.gTagManagerId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${process.env.gTagManagerId}');`}
          </Script>
        )}
      </head>
      <body>
        <ApolloWrapper>
          <ContextWrapper contextValue={{ chainConfig }}>
            {children}
          </ContextWrapper>
        </ApolloWrapper>
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
    </html>
  )
}
