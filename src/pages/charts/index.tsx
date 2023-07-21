import { Suspense, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import {
  Card,
  DetailsView,
  IconQuestion,
  IconWatch,
  Page,
  TabPanel,
} from '@/components'
import { Value } from '@/components'
import { Tab } from '@/components/Tabs'
import IconRedash from '@/images/redash.svg'
import ImageCounter from '@/images/redash/counter.svg'
import ImageLine from '@/images/redash/line.svg'
import ImagePie from '@/images/redash/pie.svg'
import ImageTable from '@/images/redash/table.svg'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRedashDashboardsAll } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import styles from './Charts.module.scss'

const TimeAgo = dynamic(() => import('../../components/TimeAgo'), {
  ssr: false,
})
interface ChartsPageProps {
  chainConfig: ChainConfigModel
  dashboards: TRedashDashboard[]
}

const ChartsPage: NextPage<ChartsPageProps> = ({ chainConfig, dashboards }) => {
  const pageTitle = `${chainConfig.name} Charts & Statistics`

  const activeDashboards =
    dashboards?.filter((item) => !item.is_archived && !item.is_draft) || []

  const tags: string[] = []
  activeDashboards?.forEach((dashboard) => {
    if (!dashboard.tags) {
      return
    }
    tags.push(...dashboard.tags)
  })

  const tagsSet = [...new Set(tags)]
  const tabs: Tab<string>[] = tagsSet
    .filter((tag) => !['Token Contract', 'Smart Contract', 'EOA'].includes(tag))
    .map((tag) => {
      return {
        title: tag,
        value: tag,
      }
    })

  const [currentTab, setCurrentTab] = useState(tabs[0] ? tabs[0].value : '')

  if (
    !chainConfig?.features?.some((x: { name: string }) => x.name === 'charts')
  ) {
    return null
  }

  const handleChange = (value: string) => {
    setCurrentTab(value)
  }

  const renderDashboardCardIllustration = (dashboard: TRedashDashboard) => {
    if (!dashboard.visualization_types?.length) {
      return <IconQuestion />
    }

    return (
      <div className={styles.illustration}>
        {dashboard.visualization_types.map((viz, idx) => {
          const [type, position] = Object.entries(viz)[0]

          let TypeImage

          switch (type.toLowerCase()) {
            case 'counter':
              TypeImage = ImageCounter
              break
            case 'chart':
            case 'line':
              TypeImage = ImageLine
              break
            case 'pie':
              TypeImage = ImagePie
              break
            case 'table':
              TypeImage = ImageTable
              break
            default:
              TypeImage = IconQuestion
          }

          return (
            <div
              className={styles.illustrationBlock}
              key={idx}
              style={{
                gridColumn: `${position.col + 1} / span ${position.sizeX}`,
                gridRow: `${position.row + 1} / span ${position.sizeY}`,
              }}
            >
              <span className={styles.illustrationType}>
                {type.toLowerCase()}
              </span>
              {<TypeImage className={styles.type} />}
            </div>
          )
        })}
      </div>
    )
  }

  const renderDashboardCardFooter = (dashboard: TRedashDashboard) => {
    return (
      <div className={styles.meta}>
        <Value
          className={styles.created}
          icon={<IconWatch />}
          value={
            <Suspense fallback={<>&nbsp;</>}>
              <TimeAgo
                timestamp={new Date(dashboard.created_at).getTime() / 1000}
              />
            </Suspense>
          }
        />
        <Image
          data-tooltip-content={dashboard.user.name}
          data-tooltip-id="app-tooltip"
          className={styles.user}
          src={dashboard.user.profile_image_url}
          alt={dashboard.user.name}
          width={32}
          height={32}
        />
      </div>
    )
  }

  const renderDashboardCard = (dashboard: TRedashDashboard) => {
    return (
      <Card
        className={styles.card}
        title={<Link href={`/charts/${dashboard.slug}`}>{dashboard.name}</Link>}
        header={
          <Link
            className={styles.redash}
            data-tooltip-id="app-tooltip"
            data-tooltip-content={`Open ${dashboard.name} in Redash`}
            target="_blank"
            rel="noreferrer noopener"
            href={`${
              process.env.NEXT_PUBLIC_REDASH_API_URL ||
              'https://redash-demo.dex.guru'
            }/dashboards/${dashboard.id}-${dashboard.slug}`}
          >
            <IconRedash className={styles.redashIcon} />
          </Link>
        }
        footer={renderDashboardCardFooter(dashboard)}
      >
        <Link href={`/charts/${dashboard.slug}`}>
          {renderDashboardCardIllustration(dashboard)}
        </Link>
      </Card>
    )
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
                  .map((dashboard) => (
                    <li className={styles.item} key={dashboard.id}>
                      {renderDashboardCard(dashboard)}
                    </li>
                  ))}
              </ul>
            </div>
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default ChartsPage

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

  if (
    !data.chainConfig.features.some(
      (x: { name: string }) => x.name === 'charts'
    )
  ) {
    ctx.res.statusCode = 404
    return { props: { chainConfig: data.chainConfig } }
  }

  const dashboards = await getRedashDashboardsAll()

  if (dashboards) {
    logger.info({ msg: 'Got redash dashboards info', dashboards })
  } else {
    logger.error(error, 'Error getting redash dashboards info')
  }

  return addApolloState(apolloClient, {
    props: {
      chainConfig: data.chainConfig,
      dashboards: dashboards?.results || null,
    },
  })
}
