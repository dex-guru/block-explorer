import { Tooltip } from 'react-tooltip'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '@/lib/apollo/client'
import { initApm } from '@/services/apmService'
import '@/styles/index.scss'

initApm()

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
      <Tooltip
        id="app-tooltip"
        variant="light"
        positionStrategy="fixed"
        clickable
      />
      <Tooltip
        openOnClick
        content="Copied!"
        variant="light"
        place="bottom"
        anchorSelect=".clipboard-copy"
        delayHide={1500}
      />
    </ApolloProvider>
  )
}
