import { GetServerSidePropsContext, NextPage } from 'next'
import { useSearchParams } from 'next/navigation'
import { isAddress } from '@ethersproject/address'
import '@rainbow-me/rainbowkit/styles.css'
import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import { ContractView, AddressView } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_ADDRESS_INFO } from '@/lib/apollo/queries'

interface AddressPageServerProps {
  address: AddressModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  tokenHoldingsStats: TokenHoldingsStatsModel
}

const AddressPage: NextPage<AddressPageServerProps> = ({
  address: addressInfo,
  chainStats,
  chainConfig,
  tokenHoldingsStats,
}) => {
  const searchParams = useSearchParams()
  const address = searchParams.get('address')
  const tab = searchParams.get('tab')
  if (!address) {
    return null
  }
  if (!tab) {
    return null
  }

  const onlyAddress = (
    Array.isArray(address) ? address[0] : address
  ).toLowerCase()

  const isContract = addressInfo?.addressType === 'smart_contract'

  if (isContract) {
    return (
      <ContractView
        address={onlyAddress}
        tab={tab}
        addressInfo={addressInfo}
        chain={{ stats: chainStats, config: chainConfig }}
        tokenHoldingsStats={tokenHoldingsStats}
      />
    )
  }

  return (
    <AddressView
      address={onlyAddress}
      tab={tab}
      addressInfo={addressInfo}
      chain={{ stats: chainStats, config: chainConfig }}
      tokenHoldingsStats={tokenHoldingsStats}
    />
  )
}

export default AddressPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { address } = ctx.query as { address: string; tab: string }

  const apolloClient = initializeApollo({ ctx })

  if (!isAddress(address)) {
    ctx.res.statusCode = 404

    const { data } = await apolloClient.query<{
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
    }>({
      query: CHAIN_STATS,
    })

    return { props: data }
  }

  const { data } = await apolloClient.query<{
    address: AddressModel
    chainStats: ChainStatsModel
    chainConfig: ChainConfigModel
    tokenHoldingsStats: TokenHoldingsStatsModel
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
