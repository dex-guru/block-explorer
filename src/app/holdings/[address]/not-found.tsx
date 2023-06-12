import { Metadata } from 'next'
import HoldingsIndex from './HoldingsIndex'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  return {
    title: 'No correct address provided',
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: `Explore transactions to see what happened with token balances and smart contracts.`,
  }
}

const NotFound = () => {
  return <HoldingsIndex />
}

export default NotFound
