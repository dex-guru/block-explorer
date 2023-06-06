import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
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
import { getLogger } from '@/lib/logger'

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
  const logger = getLogger('address')
  try {
    const { address } = ctx.query as { address: string }

    const apolloClient = initializeApollo({ ctx })

    if (!isAddress(address)) {
      ctx.res.statusCode = 404

      const { data, error } = await apolloClient.query<{
        chainStats: ChainStatsModel
        chainConfig: ChainConfigModel
      }>({
        query: CHAIN_STATS,
      })
      if (error) {
        logger.error(error, 'Error getting chain stats')
      }

      return { props: data }
    }

    logger.info({
      msg: 'Getting address info',
      address: address.toLowerCase(),
    })

    const { data, error } = await apolloClient.query<{
      address: AddressModel
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
      tokenHoldingsStats: TokenHoldingsStatsModel
    }>({
      query: GET_ADDRESS_INFO,
      variables: { address: address.toLowerCase() },
    })

    error
      ? logger.error(error, 'Error getting address info')
      : logger.info({ msg: 'Got address info', data })

    if (!data?.address?.address) {
      ctx.res.statusCode = 404
    }

    return addApolloState(apolloClient, {
      props: { ...data },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
