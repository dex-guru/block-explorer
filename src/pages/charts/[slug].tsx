import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { DetailsView, Empty, IconSearch, Page } from '@/components'
import Dashboard from '@/components/Dashboard/Dashboard'
import {
  DashboardData,
  DashboardWidgetQueryData,
} from '@/components/Dashboard/types'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import {
  getDynamicDateRangePeriod,
  isDynamicDateRangePeriod,
} from '@/lib/dates'
import { getLogger } from '@/lib/logger'

interface СhartsDetailsPageProps {
  chainConfig: ChainConfigModel
  dashboard: DashboardData
  queries: Record<number, DashboardWidgetQueryData>
}

const ChartsDetailsPage: NextPage<СhartsDetailsPageProps> = ({
  chainConfig,
  dashboard,
  queries,
}) => {
  if (
    !chainConfig?.features?.some((x: { name: string }) => x.name === 'charts')
  ) {
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
            <Dashboard {...dashboard} queries={queries} />
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

  if (
    !data.chainConfig.features.some(
      (x: { name: string }) => x.name === 'charts'
    )
  ) {
    ctx.res.statusCode = 404
    return {
      props: {},
    }
  }

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_REDASH_API_URL || 'https://redash-demo.dex.guru'
    }/api/dashboards/${slug}?legacy=true`,
    {
      headers: {
        Authorization:
          process.env.NEXT_PUBLIC_REDASH_API_KEY ||
          'aUjHBunsclDvEZkekXbAEzgeDe8yPo10UsXcpHO4',
      },
    }
  )

  let dashboard: DashboardData | null = null

  if (response.ok) {
    dashboard = await response.json()
    logger.info({ msg: `Got redash dashboard ${slug} info`, data })
  } else {
    logger.error(error, `Error getting redash dashboard ${slug} info`)
  }

  const queries: Record<number, unknown> = {}

  if (dashboard?.widgets?.length) {
    await Promise.all(
      dashboard.widgets.map(async (widget) => {
        if (!widget?.visualization?.query?.id) {
          return
        }

        const {
          id,
          options: { parameters },
        } = widget.visualization.query

        const params =
          parameters?.map((param) => {
            if (param.name === 'chain_id') {
              return [param.name, data.chainConfig.chainId]
            }

            if (param.type === 'date-range') {
              if (
                (typeof param.value === 'string' ||
                  param.value instanceof String) &&
                isDynamicDateRangePeriod(`${param.value}`)
              ) {
                return [param.name, getDynamicDateRangePeriod(`${param.value}`)]
              } else {
                return [param.name, getDynamicDateRangePeriod('d_last_30_days')]
              }
            }

            return [param.name, param.value]
          }) || []

        const url = `${
          process.env.NEXT_PUBLIC_REDASH_API_URL ||
          'https://redash-demo.dex.guru'
        }/api/queries/${id}/results`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              process.env.NEXT_PUBLIC_REDASH_API_KEY ||
              'aUjHBunsclDvEZkekXbAEzgeDe8yPo10UsXcpHO4',
          },
          body: JSON.stringify({
            parameters: Object.fromEntries(params),
          }),
        })

        if (response.ok) {
          queries[id] = await response.json()
        }
      })
    )
  }

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboard: dashboard,
      queries,
    },
  })
}
