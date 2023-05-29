import { ReactNode } from 'react'
import { ChainConfigContext } from './ChainConfigContext'
import { initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'

export default async function ChainConfigProvider({
  chainId,
  children,
}: {
  chainId: number
  children: ReactNode
}) {
  const apolloClient = initializeApollo({})

  const { data, error } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
    variables: { chainId },
  })

  if (!data) {
    console.error(
      `No chainConfig received for chainId ${chainId}! ${
        error ? JSON.stringify(error) : ''
      }`
    )
    return null
  }

  return (
    <ChainConfigContext.Provider value={data?.chainConfig}>
      {children}
    </ChainConfigContext.Provider>
  )
}
