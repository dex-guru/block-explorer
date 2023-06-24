import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isAddress, getAddress } from '@ethersproject/address'
import HoldingsPage, { IHoldingsPageProps } from './HoldingsPage'
import {
  ChainConfigModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_ADDRESS_TOKENS_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { address: string }
}): Promise<Metadata> {
  const { address } = params
  const checkSumAddress = isAddress(address) ? getAddress(address) : address

  const pageTitle = isAddress(address)
    ? `Token Holdings for ${checkSumAddress}`
    : 'No correct address provided'

  const chainConfig = await getChainConfig()

  return {
    title: pageTitle,
    icons: chainConfig.icon,
    description: `${checkSumAddress} tokens portfolio on ${chainConfig.name} ${chainConfig.chain}, explore token balances held by this wallet, and view account activity in real-time.`,
  }
}

const getProps = async (address: string): Promise<IHoldingsPageProps> => {
  const logger = getLogger('holding address')
  try {
    const apolloClient = getClient()

    if (address && !isAddress(address)) {
      notFound()
    }

    const { data, error } = await apolloClient.query<{
      tokenHoldingsStats: TokenHoldingsStatsModel
      chainConfig: ChainConfigModel
    }>({
      query: GET_ADDRESS_TOKENS_STATS,
      variables: { address: address.toLowerCase() },
    })

    error
      ? logger.error(error, 'Error getting GET_ADDRESS_TOKENS_STATS info')
      : logger.info({ msg: 'Got GET_ADDRESS_TOKENS_STATS info', data })

    return { address, ...data }
  } catch (e) {
    logger.error(e, 'getProps error on holding address page')
    throw e
  }
}

export default async function Page({
  params,
}: {
  params: { address: string }
}) {
  const { address } = params
  const props = await getProps(address)

  return <HoldingsPage {...props} />
}
