import { Metadata } from 'next'
import { IBlocksProps } from './blocks'
import BlocksPage from './blocks'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_BLOCKS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  return {
    title: 'Blocks',
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: `Explore recently created blocks on ${chainConfig.name} ${chainConfig.chain}`,
  }
}

const getProps = async (): Promise<IBlocksProps> => {
  const logger = getLogger('blocks')
  try {
    const apolloClient = getClient()

    const {
      data: { blocks, blockStats, chainStats, chainConfig },
      error,
    } = await apolloClient.query({
      query: GET_BLOCKS,
      variables: { first: 10, skip: 0 },
    })

    error
      ? logger.error(error, 'Error getting GET_BLOCKS info')
      : logger.info({
          msg: 'Got GET_BLOCKS info',
          obj: { blocks, blockStats, chainStats, chainConfig },
        })

    return { blocks, blockStats, chainStats, chainConfig }
  } catch (e) {
    logger.error(e, 'getProps error on blocks page')
    throw e
  }
}

export default async function Page() {
  const props = await getProps()

  return <BlocksPage {...props} />
}
