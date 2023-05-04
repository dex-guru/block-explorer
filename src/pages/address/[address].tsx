import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { isAddress } from '@ethersproject/address'
import { getAddress } from '@ethersproject/address'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { canto } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { cantoTestnet } from '@/chains/cantoTestnet'
import { ContractView, AddressView } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_ADDRESS_INFO, GET_TRANSACTIONS } from '@/lib/apollo/queries'

const { chains, provider } = configureChains(
  [canto, cantoTestnet],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Block Explorer',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

interface AddressPageServerProps {
  address: AddressModel
  transactions?: TransactionModel[]
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const AddressPage: NextPage<AddressPageServerProps> = ({
  address: addressInfo,
  transactions,
  chainStats,
  chainConfig,
}) => {
  const router = useRouter()
  const { address, tab } = router.query
  const isContract = addressInfo.addressType === 'smart_contract'
  if (!address) {
    return null
  }

  // if it is a contract - fetch metadata and files from sourcify
  const checksumAddress = Array.isArray(address)
    ? getAddress(address[0].toLowerCase())
    : getAddress(address.toLowerCase())

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {isContract ? (
          <ContractView
            address={checksumAddress}
            tab={tab}
            transactions={transactions}
            addressInfo={addressInfo}
            chain={{ stats: chainStats, config: chainConfig }}
          />
        ) : (
          <AddressView
            address={checksumAddress}
            tab={tab}
            transactions={transactions}
            addressInfo={addressInfo}
            chain={{ stats: chainStats, config: chainConfig }}
          />
        )}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default AddressPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { address, tab } = ctx.query as { address: string; tab: string }

  if (address && !isAddress(address)) {
    return { notFound: true }
  }
  const apolloClient = initializeApollo({ ctx })

  const { data: addressInfo } = await apolloClient.query<{
    address: AddressModel
    chainStats: ChainStatsModel
    chainConfig: ChainConfigModel
  }>({
    query: GET_ADDRESS_INFO,
    variables: { address },
  })

  const addressProps = addApolloState(apolloClient, {
    props: { ...addressInfo },
  })

  let result = { props: { ...addressProps.props } }
  // transactions tab
  if (tab === undefined) {
    const { data: transactions } = await apolloClient.query({
      query: GET_TRANSACTIONS,
      variables: { first: 10, skip: 0, address },
    })

    const transactionsProps = addApolloState(apolloClient, {
      props: { ...transactions },
    })

    result = { props: { ...result.props, ...transactionsProps.props } }
  }

  // Pass data to the page via props
  return result
}
