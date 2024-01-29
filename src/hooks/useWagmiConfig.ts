import { useMemo } from 'react'

import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
  argentWallet,
  bifrostWallet,
  bitgetWallet,
  bitskiWallet,
  braveWallet,
  clvWallet,
  coin98Wallet,
  coinbaseWallet,
  coreWallet,
  dawnWallet,
  desigWallet,
  enkryptWallet,
  foxWallet,
  frameWallet,
  frontierWallet,
  imTokenWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  mewWallet,
  oktoWallet,
  okxWallet,
  omniWallet,
  oneKeyWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  safeheronWallet,
  safepalWallet,
  subWallet,
  tahoWallet,
  talismanWallet,
  tokenPocketWallet,
  tokenaryWallet,
  trustWallet,
  uniswapWallet,
  walletConnectWallet,
  xdefiWallet,
  zealWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { publicProvider } from '@wagmi/core/providers/public'
import get from 'lodash/get'
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

  const connectors = useMemo(() => {
    const projectId = WALLET_CONNECT_PROJECT_ID
    const appName = `Block Explorer ${chains[0].id}`
    return connectorsForWallets([
      {
        groupName: 'Suggested',
        wallets: [
          injectedWallet({ chains }),
          rainbowWallet({ projectId, chains }),
          metaMaskWallet({ projectId, chains }),
          trustWallet({ chains, projectId }),
          walletConnectWallet({ projectId, chains }),
        ],
      },
      {
        groupName: 'Others',
        wallets: [
          argentWallet({ chains, projectId }),
          bitgetWallet({ chains, projectId }),
          bifrostWallet({ chains, projectId, walletConnectVersion: '2' }),
          bitskiWallet({ chains }),
          braveWallet({ chains }),
          clvWallet({ chains, projectId }),
          coinbaseWallet({ chains, appName }),
          coin98Wallet({ chains, projectId }),
          coreWallet({ chains, projectId }),
          dawnWallet({ chains }),
          desigWallet({ chains }),
          enkryptWallet({ chains }),
          foxWallet({ chains, projectId }),
          frameWallet({ chains }),
          frontierWallet({ chains, projectId }),
          ledgerWallet({ chains, projectId }),
          imTokenWallet({ chains, projectId }),
          mewWallet({ chains }),
          oktoWallet({ chains, projectId }),
          okxWallet({ chains, projectId }),
          omniWallet({ chains, projectId }),
          oneKeyWallet({ chains }),
          phantomWallet({ chains }),
          rabbyWallet({ chains }),
          safeWallet({ chains }),
          safeheronWallet({ chains }),
          safepalWallet({ chains, projectId }),
          subWallet({ chains, projectId }),
          tahoWallet({ chains }),
          talismanWallet({ chains }),
          tokenPocketWallet({ chains, projectId }),
          tokenaryWallet({ chains }),
          uniswapWallet({ chains, projectId }),
          xdefiWallet({ chains }),
          zealWallet({ chains }),
          zerionWallet({ chains, projectId }),
        ],
      },
    ])
  }, [chains])

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        autoConnect: true,
        connectors,
        publicClient,
      }),
    [connectors, publicClient]
  )

  return { wagmiConfig, chains, publicClient, publicProvider }
}
