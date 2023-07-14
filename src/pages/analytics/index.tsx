import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { AnalyticsDashboard } from './[id]'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { DetailsView, Page } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

interface AnalyticsProps {
  chainConfig: ChainConfigModel
  dashboards: {
    count: number
    page: number
    page_size: number
    results: AnalyticsDashboard[]
  }
}

const Analytics: NextPage<AnalyticsProps> = ({ chainConfig, dashboards }) => {
  const pageTitle = `${chainConfig.name} Charts & Statistics`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageTitle} />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <DetailsView title={pageTitle}>
          {dashboards.results
            ?.filter((item) => !item.is_archived && !item.is_draft)
            .map((dashboard) => {
              return (
                <Link href={`/analytics/${dashboard.id}`} key={dashboard.name}>
                  {dashboard.name}
                </Link>
              )
            })}
        </DetailsView>
      </Page>
    </>
  )
}

export default Analytics

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('analytics')

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

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_REDASH_API_URL || ''}/api/dashboards`,
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_REDASH_API_KEY || '',
      },
    }
  )

  let dashboards = null

  if (response.ok) {
    console.log(response)
    dashboards = await response.json()
    logger.info({ msg: 'Got redash dashboards info', data })
  } else {
    logger.error(error, 'Error getting redash dashboards info')
  }

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboards: dashboards,
    },
  })
}
