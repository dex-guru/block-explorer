import { Metadata } from 'next'
import Txs, { ITxsProps } from './txs'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_TRANSACTIONS_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { block?: string }
}): Promise<Metadata> {
  const { block } = searchParams

  const chainConfig = await getChainConfig()

  const pageTitle = block
    ? `Transactions for block ${block?.toString()}`
    : 'Transactions'
  return {
    title: pageTitle,
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: `Explore recently created transactions on ${chainConfig.name} ${chainConfig.chain}`,
  }
}

const getProps = async (block?: string): Promise<ITxsProps> => {
  const logger = getLogger('txs')

  try {
    const apolloClient = getClient()

    const { data, error } = await apolloClient.query({
      query: GET_TRANSACTIONS_STATS,
      variables: { blockNumber: block },
    })
    error
      ? logger.error(error, 'Error getting GET_TRANSACTIONS_STATS info')
      : logger.info({ msg: 'Got GET_TRANSACTIONS_STATS info', data })

    return {
      ...data,
      block,
    }
  } catch (e) {
    logger.error(e, 'getProps error on txs page')
    throw e
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: { block?: string }
}) {
  const { block } = searchParams
  const props = await getProps(block)

  return <Txs {...props} />
}
