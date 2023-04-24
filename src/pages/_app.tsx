import { useApollo } from '@/lib/apollo/client'
import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'

import '@/styles/globals.scss'

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
