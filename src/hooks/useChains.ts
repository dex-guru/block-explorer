import { useEffect } from 'react'

import { useLazyQuery } from '@apollo/client'

import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { GET_ALL_CHAINS } from '@/lib/apollo/queries'

export const useChains = () => {
  return useChainsWhen(true)
}

export const useChainsWhen = (when = true) => {
  const [getChains, { loading, data }] = useLazyQuery<{
    allChainConfigs: ChainConfigModel[]
  }>(GET_ALL_CHAINS)

  useEffect(() => {
    when && getChains()
  }, [when, getChains])

  return { loading, data: data?.allChainConfigs }
}
