import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Block from './block'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_BLOCKS_BY_NUMBER } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { isValidBlockNumber } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { block: string }
}): Promise<Metadata> {
  const { block } = params

  const pageTitle = block
    ? `Block #${block}`
    : isValidBlockNumber(block)
    ? `No block ${block}`
    : 'Not a block'

  const chainConfig = await getChainConfig()

  return {
    title: pageTitle,
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: `Explore block number ${block} to see included transactions.`,
  }
}

export interface IBlockProps {
  data: BlockModel | null
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const getProps = async (block: string): Promise<IBlockProps> => {
  const logger = getLogger('block')
  try {
    const apolloClient = getClient()

    if (!isValidBlockNumber(block)) {
      notFound()
    }

    const { data, error } = await apolloClient.query<{
      blocks: BlockModel[]
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
    }>({
      query: GET_BLOCKS_BY_NUMBER,
      variables: { number: Number(block) },
    })

    error
      ? logger.error(error, 'Error getting GET_BLOCKS_BY_NUMBER info')
      : logger.info({ msg: 'Got GET_BLOCKS_BY_NUMBER info', data })

    const { blocks, chainStats, chainConfig } = data

    if (!data.blocks?.length) {
      notFound()
    }

    return { data: blocks[0] || null, chainStats, chainConfig }
  } catch (e) {
    logger.error(e, 'getProps error on address page')
    throw e
  }
}

export default async function Page({ params }: { params: { block: string } }) {
  const { block } = params
  const props = await getProps(block)

  return <Block {...props} />
}
