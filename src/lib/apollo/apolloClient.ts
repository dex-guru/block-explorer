import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createIsomorphicLink } from './client'

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: createIsomorphicLink(),
  })
})
