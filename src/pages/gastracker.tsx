import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import Dashboard from '@/components/Dashboard'
import DetailsView from '@/components/DetailsView'
import Page from '@/components/Page'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRedashDashboard } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'

interface GasTrackerPageProps {
  chainConfig: ChainConfigModel
  dashboard: TRedashDashboard
}

const GasTrackerPage: NextPage<GasTrackerPageProps> = ({
  dashboard,
  chainConfig,
}) => {
  if (!dashboard?.id || !chainConfig) {
    return null
  }

  const pageTitle = `${chainConfig.name} Gas Tracker`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="CSR Dashboard" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <Dashboard
          data={dashboard}
          params={{
            network: chainConfig.shortName,
          }}
        />
      </Page>
    </>
  )
}

export default GasTrackerPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('csr')
  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  error
    ? logger.error(error, 'Error getting chainConfig info')
    : logger.info({ msg: 'Got chainConfig info', data })

  return addApolloState(apolloClient, {
    props: {
      dashboard: await getRedashDashboard('gas_tracker'),
      chainConfig: data.chainConfig,
    },
  })
}
