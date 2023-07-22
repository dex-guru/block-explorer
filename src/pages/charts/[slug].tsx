import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { DetailsView, Empty, IconSearch, Page } from '@/components'
import Dashboard from '@/components/Dashboard/Dashboard'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRadashDashboardWithResults } from '@/lib/redash/client'
import { TRedashDashboard, TRedashQueryResponse } from '@/lib/redash/types'
import { checkChainFeature } from '@/lib/utils'

interface СhartsDetailsPageProps {
  chainConfig: ChainConfigModel
  dashboard: TRedashDashboard
  queries: Record<number, TRedashQueryResponse>
}

const ChartsDetailsPage: NextPage<СhartsDetailsPageProps> = ({
  chainConfig,
  dashboard,
  queries,
}) => {
  if (!checkChainFeature(chainConfig, 'charts')) {
    return null
  }

  return (
    <>
      <Head>
        <title>{dashboard?.name || 'No dashboard'}</title>
        <meta name="description" content={dashboard?.name} />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        {!dashboard && (
          <Empty icon={<IconSearch />} title="No dashboard  was found" />
        )}

        {!!dashboard && (
          <DetailsView title={dashboard.name}>
            <Dashboard data={dashboard} queriesResponse={queries} />
          </DetailsView>
        )}
      </Page>
    </>
  )
}

export default ChartsDetailsPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('analytics')
  const { slug } = ctx.query as { slug: string }

  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  if (error) {
    logger.error(error, 'Error getting chainConfig info')

    return {
      props: {
        chainConfig: data.chainConfig,
      },
    }
  }

  if (!checkChainFeature(data.chainConfig, 'charts')) {
    ctx.res.statusCode = 404
    return {
      props: {},
    }
  }

  const { dashboard, queries } = await getRadashDashboardWithResults(slug, {
    chain_id: data.chainConfig.chainId,
  })

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboard,
      queries,
    },
  })
}
