import { Metadata } from 'next'
import VerifyPage from './VerifyPage'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  return {
    title: 'Verify Contract',
    icons: chainConfig.icon,
    description: 'Verify Contract',
  }
}

export default async function Page() {
  return <VerifyPage />
}
