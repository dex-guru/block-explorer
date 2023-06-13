/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { SchemaLink } from '@apollo/client/link/schema'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { sendApmError } from '@/services/apmService'

const errorLink = onError(({ graphQLErrors, networkError }) => {
  graphQLErrors?.forEach(({ message, locations, path }) => {
    const errorMessage = `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
    sendApmError(errorMessage)
    console.error(errorMessage)
  })

  if (networkError) {
    sendApmError(`[Network error]: ${networkError}`)
    console.error(`[Network error]: ${networkError}`)
  }
})

const retryLink = new RetryLink({
  delay: {
    initial: 250,
    max: 2500,
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => !!error,
  },
})

export function createIsomorphicLink() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
    credentials: 'same-origin',
  })

  return from([errorLink, retryLink, httpLink])
}

// DEPRECATED

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

type SchemaContext =
  | SchemaLink.ResolverContext
  | SchemaLink.ResolverContextFunction

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createIsomorphicLink(),
    cache: new InMemoryCache(),
  })
}

interface InitApollo {
  initialState?: any
  ctx?: SchemaContext
}

export function initializeApollo({ ctx, initialState }: InitApollo) {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (initialState) {
    const existingCache = _apolloClient.extract()

    const data = merge(existingCache, initialState, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    _apolloClient.cache.restore(data)
  }

  if (typeof window === 'undefined') {
    return _apolloClient
  }

  if (!apolloClient) {
    apolloClient = _apolloClient
  }

  return _apolloClient
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: { props: any }
) {
  pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()

  return pageProps
}

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(
    () => initializeApollo({ initialState: state }),
    [state]
  )
  return store
}
