import { Metadata } from 'next'
import BlockIndex from './BlockIndex'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  return {
    title: 'No block number provided',
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: `Explore block to see included transactions.`,
  }
}

const NotFound = () => {
  return <BlockIndex />
}

export default NotFound
