import { FC, useEffect, useState } from 'react'
import { AnalyticsProps } from './types'
import Dashboard from '@/components/Dashboard'
import { LoadingCard } from '@/components/Loading'
import TabPanel from '@/components/TabPanel'
import {
  getRedashDashboard,
  getRedashDashboardsByTag,
} from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import styles from './Analytics.module.scss'

const Analytics: FC<AnalyticsProps> = ({ tag, params }) => {
  const [isMounted, setIsMounted] = useState(false)
  const [dashboardsData, setDashboardsData] = useState<
    TRedashDashboard[] | null
  >(null)

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
        dashboardsList?.results?.map(async (dashboard) => {
          dashboards.push(await getRedashDashboard(dashboard.id))
        })
      )

      setDashboardsData(dashboards)
    }

    getData()
  }, [isMounted, tag])

  if (!dashboardsData?.length) {
    return <LoadingCard />
  }

  const tabs = dashboardsData?.map((dashboard) => {
    return {
      title: dashboard.name,
      value: dashboard.id,
      content: <Dashboard data={dashboard} params={params} />,
    }
  })

  return (
    <TabPanel
      tabs={tabs}
      value={dashboardsData[0]?.id || ''}
      className={styles.container}
    />
  )
}

export default Analytics
