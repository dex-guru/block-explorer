import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { isAddress } from '@ethersproject/address'
import '@rainbow-me/rainbowkit/styles.css'
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
  const router = useRouter()
  const { address, tab } = router.query

  if (!address) {
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
        contractCreator={contractCreator}
        tokenHoldingsStats={tokenHoldingsStats}
        balancesStats={balancesStats}
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
