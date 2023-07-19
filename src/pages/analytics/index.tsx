import { useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import {
  Button,
  Card,
  DetailsView,
  IconQuestion,
  Page,
  TabPanel,
} from '@/components'
import { DashboardData } from '@/components/Dashboard/types'
import { Tab } from '@/components/Tabs'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import styles from './Analytics.module.scss'

interface AnalyticsProps {
  chainConfig: ChainConfigModel
  dashboards: {
    count: number
    page: number
    page_size: number
    results: DashboardData[]
  }
}

const Analytics: NextPage<AnalyticsProps> = ({ chainConfig, dashboards }) => {
  const pageTitle = `${chainConfig.name} Charts & Statistics`

  const activeDashboards =
    dashboards.results?.filter((item) => !item.is_archived && !item.is_draft) ||
    []

  const tags: string[] = []
  activeDashboards?.forEach((dashboard) => {
    if (!dashboard.tags) {
      return
    }
    tags.push(...dashboard.tags)
  })

  const tagsSet = [...new Set(tags)]
  const tabs: Tab<string>[] = tagsSet.map((tag) => {
    return {
      title: tag,
      value: tag,
    }
  })

  const [currentTab, setCurrentTab] = useState(tabs[0].value || '')

  const handleChange = (value: string) => {
    setCurrentTab(value)
  }

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
          <TabPanel
            tabs={tabs}
            value={currentTab}
            onChange={handleChange}
            tabsClassName={styles.tabs}
          >
            <div className={styles.dashboards}>
              <ul className={styles.list}>
                {activeDashboards
                  .filter((dashboard) => dashboard.tags.includes(currentTab))
                  .map((dashboard) => {
                    return (
                      <li className={styles.item} key={dashboard.name}>
                        <Card
                          className={styles.card}
                          title={
                            <Link href={`/analytics/${dashboard.id}`}>
                              {dashboard.name}
                            </Link>
                          }
                          header={
                            <Button
                              className={styles.redash}
                              caption="Open in Redash"
                              target="_blank"
                              rel="noreferrer noopener"
                              href={`${
                                process.env.NEXT_PUBLIC_REDASH_API_URL ||
                                'https://redash-demo.dex.guru'
                              }/dashboards/${dashboard.id}-${dashboard.slug}`}
                            />
                          }
                        >
                          <Link href={`/analytics/${dashboard.id}`}>
                            <IconQuestion />
                          </Link>
                        </Card>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </TabPanel>
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
    `${
      process.env.NEXT_PUBLIC_REDASH_API_URL || 'https://redash-demo.dex.guru'
    }/api/dashboards`,
    {
      headers: {
        Authorization:
          process.env.NEXT_PUBLIC_REDASH_API_KEY ||
          'aUjHBunsclDvEZkekXbAEzgeDe8yPo10UsXcpHO4',
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
