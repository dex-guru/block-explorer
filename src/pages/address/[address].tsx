import { useMemo } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { isAddress } from '@ethersproject/address'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  ContractCreatorModel,
  TokenBalancesStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import { ContractView, AddressView } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_ADDRESS_INFO } from '@/lib/apollo/queries'

interface AddressPageServerProps {
  address: AddressModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  contractCreator: ContractCreatorModel
  tokenHoldingsStats: TokenHoldingsStatsModel
  balancesStats: TokenBalancesStatsModel
}

const AddressPage: NextPage<AddressPageServerProps> = ({
  address: addressInfo,
  chainStats,
  chainConfig,
  contractCreator,
  tokenHoldingsStats,
  balancesStats,
}) => {
  const { chains, provider } = useMemo(() => {
    const currentChain = {
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
      }),
    [chains]
  )

  const wagmiClient = useMemo(
    () =>
      createClient({
        autoConnect: true,
        connectors,
        provider,
      }),
    [connectors, provider]
  )

  const router = useRouter()
  const { address, tab } = router.query
  const isContract = addressInfo?.addressType === 'smart_contract'
  if (!address) {
    return null
  }

  // if it is a contract - fetch metadata and files from sourcify
  const onlyAddress = (
    Array.isArray(address) ? address[0] : address
  ).toLowerCase()

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {isContract && (
          <ContractView
            address={onlyAddress}
            tab={tab}
            addressInfo={addressInfo}
            chain={{ stats: chainStats, config: chainConfig }}
            contractCreator={contractCreator}
            tokenHoldingsStats={tokenHoldingsStats}
            balancesStats={balancesStats}
          />
        )}

        {!isContract && (
          <AddressView
            address={onlyAddress}
            tab={tab}
            addressInfo={addressInfo}
            chain={{ stats: chainStats, config: chainConfig }}
            tokenHoldingsStats={tokenHoldingsStats}
          />
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default AddressPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { address } = ctx.query as { address: string; tab: string }

  if (!isAddress(address)) {
    ctx.res.statusCode = 404

    return { props: {} }
  }

  const apolloClient = initializeApollo({ ctx })

  const { data } = await apolloClient.query<{
    address: AddressModel
    chainStats: ChainStatsModel
    chainConfig: ChainConfigModel
    tokenHoldingsStats: TokenHoldingsStatsModel
    balancesStats: TokenBalancesStatsModel
  }>({
    query: GET_ADDRESS_INFO,
    variables: { address: address.toLowerCase() },
  })

  if (!data?.address?.address) {
    ctx.res.statusCode = 404
  }

  return addApolloState(apolloClient, {
    props: { ...data },
  })
}
