import { Metadata } from 'next'
import Index, { IndexProps } from '.'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
  CsrStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { ITEMS_PER_PAGE } from '@/constants'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_BLOCKS_TXNS_CHAIN_STATS } from '@/lib/apollo/queries'
import { getBlocksWithTimeDiff } from '@/lib/utils'

// export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  const pageTitle = `${chainConfig.name}${
    chainConfig.chain ? ` ${chainConfig.chain}` : ''
  } Block Explorer`

  return {
    title: pageTitle,
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: `Discover the power of ${chainConfig.name} blockchain with our reliable block explorer. Track transactions, explore blocks, and view network statistics in real time. Perfect for beginners and experts alike.`,
  }
}

async function getProps(): Promise<IndexProps> {
  const apolloClient = getClient()

  const { data } = await apolloClient.query<{
    blocks: BlockModel[]
    transactions: TransactionModel[]
    chainStats: ChainStatsModel
    chainConfig: ChainConfigModel
    csrStats: CsrStatsModel
  }>({
    query: GET_BLOCKS_TXNS_CHAIN_STATS,
    // per_page + 1 - last item needs for time diff
    variables: { first: ITEMS_PER_PAGE + 1, skip: 0 },
  })

  const blocksWithTimeDiff = getBlocksWithTimeDiff(
    data?.blocks || [],
    ITEMS_PER_PAGE
  )
  return {
    ...data,
    blocks: blocksWithTimeDiff,
  }
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const props = await getProps()
  // Forward fetched data to your Client Component
  return <Index {...props} />
}
