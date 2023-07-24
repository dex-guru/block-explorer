import { useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import DetailsView from '@/components/DetailsView'
import Heading from '@/components/Heading'
import { IconQuestion } from '@/components/Icons'
import Page from '@/components/Page'
import TabPanel from '@/components/TabPanel'
import { Tab } from '@/components/Tabs'
import ImageArea from '@/images/redash/area.svg'
import ImageBar from '@/images/redash/bar.svg'
import ImageCounter from '@/images/redash/counter.svg'
import ImageLine from '@/images/redash/line.svg'
import ImagePie from '@/images/redash/pie.svg'
import ImageTable from '@/images/redash/table.svg'
import ImageText from '@/images/redash/text.svg'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { getRedashDashboardsAll } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import { checkChainFeature, getSlug } from '@/lib/utils'
import styles from './Charts.module.scss'

interface ChartsPageProps {
  chainConfig: ChainConfigModel
  dashboards: TRedashDashboard[]
}

const ChartsPage: NextPage<ChartsPageProps> = ({ chainConfig, dashboards }) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const { tab } = router.query

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
      const slug = getSlug(tag)
      return {
        title: tag,
        value: slug,
        to: { pathname, query: { tab: slug } },
      }
    })

  const [currentTab, setCurrentTab] = useState(
    tab || tabs[0] ? tabs[0].value : ''
  )

  if (!checkChainFeature(chainConfig, 'charts')) {
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
          const [type, options] = Object.entries(viz)[0]

          const exactType = (options?.globalSeriesType || type).toLowerCase()

          const typeProps = {
            className: clsx(
              styles.illustrationBlock,
              styles[`illustrationBlock-${exactType}`]
            ),
            style: {
              gridColumn: `${options.col + 1} / span ${options.sizeX}`,
              gridRow: `${options.row + 1} / span ${options.sizeY}`,
            },
          }

          if (exactType === 'text') {
            return <div {...typeProps} key={idx} />
          }

          let TypeImage

          switch (exactType) {
            case 'counter':
              TypeImage = ImageCounter
              break
            case 'chart':
            case 'line':
              TypeImage = ImageLine
              break
            case 'area':
              TypeImage = ImageArea
              break
            case 'column':
            case 'bar':
              TypeImage = ImageBar
              break
            case 'pie':
              TypeImage = ImagePie
              break
            case 'table':
              TypeImage = ImageTable
              break
            case 'text':
              TypeImage = ImageText
              break
            default:
              TypeImage = IconQuestion
          }

          return (
            <div {...typeProps} key={idx}>
              <TypeImage className={styles.illustrationType} />
            </div>
          )
        })}
      </div>
    )
  }

  const renderDashboardCard = (dashboard: TRedashDashboard) => {
    return (
      <Link href={`/charts/${dashboard.slug}`} className={styles.dashboard}>
        <div className={styles.dashboardHeader}>
          <Heading size="sm" className={styles.dashboardTitle}>
            {dashboard.name}
          </Heading>

          <div className={styles.dashboardAuthor}>
            <Image
              src={dashboard.user.profile_image_url}
              className={styles.dashboardAvatar}
              alt={dashboard.user.name}
              width={24}
              height={24}
            />
          </div>
        </div>
        <div className={styles.dashboardBody}>
          {renderDashboardCardIllustration(dashboard)}
        </div>
      </Link>
    )
  }

  const currentTabTag =
    tabs.find((tab) => {
      return tab.value === (currentTab || '')
    })?.title || ''

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
                  .filter((dashboard) => dashboard.tags.includes(currentTabTag))
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

  if (!checkChainFeature(data.chainConfig, 'charts')) {
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
