import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { isAddress } from 'viem'

import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import ContractView from '@/components/ContractView'
import { IconNoData } from '@/components/Icons'
import Page from '@/components/Page'
import StateView from '@/components/StateView'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_ADDRESS_INFO } from '@/lib/apollo/queries'
import { getCMCTokenSlug } from '@/lib/coinmarketcap'
import { getLogger } from '@/lib/logger'

interface TokenPageServerProps {
  address: AddressModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  tokenHoldingsStats: TokenHoldingsStatsModel
  tokenSlug?: string
}

const TokenPage: NextPage<TokenPageServerProps> = ({
  address: addressInfo,
  chainStats,
  chainConfig,
  tokenHoldingsStats,
  tokenSlug,
}) => {
  const router = useRouter()
  const { address, tab } = router.query

  if (!address) {
    return null
  }

  const onlyAddress = (Array.isArray(address) ? address[0] : address).toLowerCase()

  const isContract = addressInfo?.addressType === 'smart_contract'

  if (isContract) {
    return (
      <ContractView
        address={onlyAddress}
        tab={tab}
        type="token"
        addressInfo={addressInfo}
        chain={{ stats: chainStats, config: chainConfig }}
        tokenHoldingsStats={tokenHoldingsStats}
        tokenSlug={tokenSlug}
      />
    )
  }

  const pageTitle = `This is not a ${chainConfig.name} token address`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore token to track recent transactions, explore its balances, and view token activity in real time.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <StateView icon={<IconNoData />} title="No address provided" />
      </Page>
    </>
  )
}

export default TokenPage

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

    const { data, error } = await apolloClient.query<{
      address: AddressModel
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
      tokenHoldingsStats: TokenHoldingsStatsModel
    }>({
      query: GET_ADDRESS_INFO,
      variables: { address: address.toLowerCase() },
    })

    error && logger.error(error, 'Error getting address info')

    if (!data?.address?.address) {
      ctx.res.statusCode = 404
    }

    const tokenSlug = await getCMCTokenSlug(address)

    return addApolloState(apolloClient, {
      props: { ...data, tokenSlug: tokenSlug },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
