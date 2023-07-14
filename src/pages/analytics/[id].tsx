import { useEffect, useRef } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { Page } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import styles from './Analytics.module.scss'

export interface AnalyticsDashboard {
  id: number
  name: string
  slug: string
  is_draft: boolean
  is_archived: boolean
  public_url: string
}

interface AnalyticsProps {
  chainConfig: ChainConfigModel
  dashboard: AnalyticsDashboard
}

const Analytics: NextPage<AnalyticsProps> = ({ chainConfig, dashboard }) => {
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
        <title>{dashboard.name}</title>
        <meta name="description" content={dashboard.name} />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <div className={styles.container}>
          <iframe
            ref={refIframe}
            src={dashboard.public_url}
            width="100%"
            className={styles.iframe}
          />
        </div>
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
    `${process.env.NEXT_PUBLIC_REDASH_API_URL || ''}/api/dashboards/${id}`,
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_REDASH_API_KEY || '',
      },
    }
  )

  let dashboard = null

  if (response.ok) {
    console.log(response)
    dashboard = await response.json()
    logger.info({ msg: `Got redash dashboard ${id} info`, data })
  } else {
    logger.error(error, `Error getting redash dashboard ${id} info`)
  }

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboard: dashboard,
    },
  })
}
