import { from, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
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
    retryIf: (error) => !!error,
  },
})

export function createIsomorphicLink() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
    credentials: 'same-origin',
  })

  return from([errorLink, retryLink, httpLink])
}
