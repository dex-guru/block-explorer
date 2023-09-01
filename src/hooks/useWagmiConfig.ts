import { useMemo } from 'react'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { publicProvider } from '@wagmi/core/providers/public'
import { get } from 'lodash'
import * as viemChains from 'viem/chains'
import { configureChains, createConfig } from 'wagmi'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { WALLET_CONNECT_PROJECT_ID } from '@/constants'

export const useWagmiConfig = (chainConfig: ChainConfigModel) => {
  const { chains, publicClient } = useMemo(() => {
    const viemChainName = Object.keys(viemChains).find(
      (chainName) => get(viemChains, chainName).id === chainConfig.chainId
    )
    const viemChain = viemChainName ? get(viemChains, viemChainName) : undefined
    const currentChain = {
      ...viemChain,
      id: chainConfig.chainId,
      name: chainConfig.name,
      network: chainConfig.shortName,
      nativeCurrency: chainConfig.nativeCurrency,
      rpcUrls: {
        default: {
          http: chainConfig.rpc,
        },
        public: {
          http: chainConfig.rpc,
        },
      },
      blockExplorers: {
        default: {
          name: chainConfig.explorers[0].name,
          url: chainConfig.explorers[0].url,
        },
      },
    }

    delete currentChain.fees

    return configureChains([currentChain], [publicProvider()])
  }, [
    chainConfig.chainId,
    chainConfig.explorers,
    chainConfig.name,
    chainConfig.nativeCurrency,
    chainConfig.rpc,
    chainConfig.shortName,
  ])

  const { connectors } = useMemo(
    () =>
      getDefaultWallets({
        appName: 'Block Explorer',
        chains,
        projectId: WALLET_CONNECT_PROJECT_ID,
      }),
    [chains]
  )

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        autoConnect: true,
        connectors,
        publicClient,
      }),
    [connectors, publicClient]
  )

  return { wagmiConfig, chains }
}
