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

const getAddressPageTitle = (
  address: string,
  checkSumAddress?: string
): string =>
  address
    ? `Address ${checkSumAddress}`
    : isAddress(address)
    ? `No address ${address}`
    : 'Not an address'

const getContractPageTitle = (checkSumAddress: string): string =>
  `Contract ${checkSumAddress}`

export async function generateMetadata({
  params,
}: {
  params: { address: string }
}): Promise<Metadata> {
  const { address } = params
  const { address: addressInfo } = await getAddressPageModel(address)

  const checkSumAddress = isAddress(address) ? getAddress(address) : address
  const isContract = addressInfo?.addressType === 'smart_contract'

  const pageTitle = isContract
    ? getContractPageTitle(checkSumAddress)
    : getAddressPageTitle(address, checkSumAddress)
  const decsription = isContract
    ? `Explore smart contract ${
        addressInfo.name || addressInfo.address
      } to track recent transactions, read or write contact variables using ABI interface, and view smart contract activity in real-time.`
    : `Explore ${checkSumAddress} to track recent transactions, explore token balances held by this wallet, and view account activity in real time.`
  const chainConfig = await getChainConfig()

  return {
    title: pageTitle,
    icons: chainConfig.icon,
    description: decsription,
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
