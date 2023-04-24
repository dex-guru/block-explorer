import { Tooltip } from 'react-tooltip'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '@/lib/apollo/client'
import '@/styles/index.scss'

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
    </ApolloProvider>
  )
}
