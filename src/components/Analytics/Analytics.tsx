import { FC, useEffect, useState } from 'react'

import Dashboard from '@/components/Dashboard'
import { LoadingCard } from '@/components/Loading'
import TabPanel from '@/components/TabPanel'
import { getRedashDashboard, getRedashDashboardsByTag } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'

import Card from '../Card'
import { AnalyticsProps } from './types'

import styles from './Analytics.module.scss'

const Analytics: FC<AnalyticsProps> = ({ tag, params }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [dashboardsData, setDashboardsData] = useState<TRedashDashboard[] | null>(null)
  const [tab, setTab] = useState<number>(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    const getData = async () => {
      if (!tag) {
        return
      }

      const dashboardsList = await getRedashDashboardsByTag(tag)

      if (!dashboardsList?.results?.length) {
        return
      }

      const dashboards: TRedashDashboard[] = []

      await Promise.all(
        dashboardsList?.results
          ?.filter((dashboard) => !dashboard.is_draft)
          .map(async (dashboard) => {
            dashboards.push(await getRedashDashboard(dashboard.id))
          })
      )

      setDashboardsData(dashboards)
    }

    getData()
  }, [isMounted, tag])

  useEffect(() => {
    setTab(dashboardsData?.[0]?.id || 0)
  }, [dashboardsData])

  if (!dashboardsData?.length) {
    return <LoadingCard />
  }

  if (dashboardsData?.length === 1) {
    return (
      <Card className={styles.container}>
        <Dashboard data={dashboardsData[0]} params={params} className={styles.dashboard} />
      </Card>
    )
  }

  const tabs = dashboardsData?.map((dashboard) => {
    return {
      title: dashboard.name,
      value: dashboard.id,
      content: <Dashboard data={dashboard} params={params} className={styles.dashboard} />,
    }
  })

  const handleChange = (value: number) => {
    setTab(value)
  }

  return (
    <Card className={styles.container}>
      <TabPanel
        onChange={handleChange}
        tabs={tabs}
        value={tab}
        className={styles.panel}
        tabsClassName={styles.tabs}
      />
    </Card>
  )
}

export default Analytics
