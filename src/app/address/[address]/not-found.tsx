import { Metadata } from 'next'
import AddressIndex from './AddressIndex'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  return {
    title: 'No address provided',
    icons: chainConfig.icon,
    description: `Explore address to track recent transactions, explore token balances held by this wallet, and view account activity in real time.`,
  }
}

const NotFound = () => {
  return <AddressIndex />
}

export default NotFound
