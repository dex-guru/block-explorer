import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import Ad from '@/components/Ad'
import Dashboard from '@/components/Dashboard/Dashboard'
import { IconSearch } from '@/components/Icons'
import Page from '@/components/Page'
import StateView from '@/components/StateView'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRedashDashboard } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import { checkChainFeature } from '@/lib/utils'

interface СhartsDetailsPageProps {
  chainConfig: ChainConfigModel
  dashboard: TRedashDashboard
}

const ChartsDetailsPage: NextPage<СhartsDetailsPageProps> = ({
  chainConfig,
  dashboard,
}) => {
  if (!checkChainFeature(chainConfig, 'charts')) {
    return null
  }

  const pageTitle = `${dashboard?.name || 'No dashboard'} for ${
    chainConfig.name
  }`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={dashboard?.name} />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        {!dashboard && (
          <StateView icon={<IconSearch />} title="No dashboard  was found" />
        )}

        {!!dashboard && (
          <Dashboard
            data={dashboard}
            params={{ network: chainConfig.shortName }}
          />
        )}

        <Ad />
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

  const dashboard = await getRedashDashboard(slug)

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboard,
    },
  })
}
