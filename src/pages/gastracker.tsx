import { useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import Dashboard from '@/components/Dashboard'
import DetailsView from '@/components/DetailsView'
import GasPrice from '@/components/GasPrice'
import Page from '@/components/Page'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRedashDashboard } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import { checkChainFeature } from '@/lib/utils'

interface GasTrackerPageProps {
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
  dashboard: TRedashDashboard
}

const GasTrackerPage: NextPage<GasTrackerPageProps> = ({
  dashboard,
  chainConfig,
  chainStats,
}) => {
  const { publicClient } = useWagmiConfig(chainConfig)

  const [gasData, setGasData] = useState<{
    base: number
    low: number
    avg: number
    high: number
  } | null>(null)

  const low = Math.ceil(((gasData?.base || 0) + (gasData?.low || 0)) / 10 ** 9)
  const high = Math.ceil(
    ((gasData?.base || 0) + (gasData?.high || 0)) / 10 ** 9
  )

  const pageTitle = `${chainConfig.name} Gas Tracker${
    gasData
      ? `: ${low}${low !== high ? ` – ${high}` : ''} ${chainConfig.gasUnit}`
      : ''
  }`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="CSR Dashboard" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <DetailsView title={`${chainConfig.name} Gas Tracker`}>
          <GasPrice
            chainConfig={chainConfig}
            chainStats={chainStats}
            publicClient={publicClient}
            onChange={setGasData}
          />
        </DetailsView>
        {!!dashboard && checkChainFeature(chainConfig, 'charts') && (
          <Dashboard
            data={dashboard}
            params={{
              network: chainConfig.shortName,
            }}
          />
        )}
      </Page>
    </>
  )
}

export default GasTrackerPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('csr')
  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  error
    ? logger.error(error, 'Error getting chainConfig info')
    : logger.info({ msg: 'Got chainConfig info', data })

  return addApolloState(apolloClient, {
    props: {
      dashboard: await getRedashDashboard('gas_tracker'),
      chainConfig: data.chainConfig,
      chainStats: data.chainStats,
    },
  })
}
