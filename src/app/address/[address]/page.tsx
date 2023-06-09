import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isAddress, getAddress } from '@ethersproject/address'
import AddressPage from './address'
import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_ADDRESS_INFO } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { address: string }
}): Promise<Metadata> {
  const { address } = params

  const checkSumAddress = isAddress(address) ? getAddress(address) : address

  const pageTitle = address
    ? `Address ${checkSumAddress}`
    : isAddress(address)
    ? `No address ${address}`
    : 'Not an address'

  const chainConfig = await getChainConfig()

  return {
    title: pageTitle,
    icons: chainConfig.icon,
    description: `Explore ${checkSumAddress} to track recent transactions, explore token balances held by this wallet, and view account activity in real time.`,
  }
}

const getProps = async (address: string) => {
  const logger = getLogger('address')
  try {
    const apolloClient = getClient()

    if (!isAddress(address)) {
      logger.error(address, `Address ${address} is not valid`)

      notFound()
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
      notFound()
    }

    return { ...data }
  } catch (e) {
    logger.error(e, 'getProps error on address page')
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

  return <AddressPage {...props} />
}
