import '@/styles/index.scss'
import { ApolloProvider } from '@apollo/client'
import { Tooltip } from 'react-tooltip'
import { useApollo } from '@/lib/apollo/client'
import type { AppProps } from 'next/app'

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
