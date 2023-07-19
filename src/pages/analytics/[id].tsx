import { useEffect, useRef } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { DetailsView, Empty, IconSearch, Page } from '@/components'
import Dashboard from '@/components/Dashboard/Dashboard'
import {
  DashboardData,
  DashboardWidgetQueryResult,
} from '@/components/Dashboard/types'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

interface AnalyticsProps {
  chainConfig: ChainConfigModel
  dashboard: DashboardData
  queriesResult: Record<number, DashboardWidgetQueryResult>
}

const Analytics: NextPage<AnalyticsProps> = ({
  chainConfig,
  dashboard,
  queriesResult,
}) => {
  const refIframe = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const resizeIframe = (message: MessageEvent) => {
      if (refIframe.current && message.data.type === 'resize') {
        refIframe.current.style.height = `${message.data.height}px`
      }
    }

    window.addEventListener('message', resizeIframe)

    return (): void => {
      window.removeEventListener('message', resizeIframe)
    }
  })

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
            <Dashboard {...dashboard} queriesResults={queriesResult} />
          </DetailsView>
        )}
      </Page>
    </>
  )
}

export default Analytics

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('analytics')
  const { id } = ctx.query as { id: string }

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
    `${
      process.env.NEXT_PUBLIC_REDASH_API_URL || 'https://redash-demo.dex.guru'
    }/api/dashboards/${id}`,
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
    logger.info({ msg: `Got redash dashboard ${id} info`, data })
  } else {
    logger.error(error, `Error getting redash dashboard ${id} info`)
  }

  const queriesResult: Record<number, unknown> = {}

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

            return [param.name, param.value]
          }) || []

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_REDASH_API_URL ||
            'https://redash-demo.dex.guru'
          }/api/queries/${id}/results`,
          {
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
          }
        )

        if (response.ok) {
          const result = await response.json()
          queriesResult[id] = result.query_result
        }
      })
    )
  }

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboard: dashboard,
      queriesResult,
    },
  })
}
