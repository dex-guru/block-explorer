import { Metadata } from 'next'
import CSRStats, { ICSRStatsProps } from './csr'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_CSR_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const chainConfig = await getChainConfig()

  return {
    title: 'CSR Dashboard',
    viewport: 'width=device-width, initial-scale=1',
    icons: chainConfig.icon,
    description: 'CSR Dashboard',
  }
}

const getProps = async (): Promise<ICSRStatsProps> => {
  const logger = getLogger('csr')
  try {
    const apolloClient = getClient()

    const { data, error } = await apolloClient.query({
      query: GET_CSR_STATS,
    })
    error
      ? logger.error(error, 'Error getting csr info')
      : logger.info({ msg: 'Got csr info', data })

    return {
      csrStats: data.csrStats || null,
      chainConfig: data.chainConfig,
    }
  } catch (e) {
    logger.error(e, 'getProps error on csr page')
    throw e
  }
}

export default async function Page() {
  const props = await getProps()

  return <CSRStats {...props} />
}
