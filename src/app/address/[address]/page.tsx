import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isAddress, getAddress } from '@ethersproject/address'
import AddressPage, { IAddressPageProps } from './address'
import {
  getAddressPageModel,
  getChainConfig,
} from '@/lib/apollo/apolloServerSideQueries'
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

const getProps = async (address: string): Promise<IAddressPageProps> => {
  const logger = getLogger('address')
  try {
    if (!isAddress(address)) {
      logger.error(address, `Address ${address} is not valid`)

      notFound()
    }

    const data = await getAddressPageModel(address)

    if (!data?.address?.address) {
      notFound()
    }

    return data
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
