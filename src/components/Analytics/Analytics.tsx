import { FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import Card from '../Card'
import Dashboard from '../Dashboard/Dashboard'
import { LoadingCard } from '../Loading'
import TabPanel from '../TabPanel'
import { AnalyticsProps } from './types'
import {
  getRadashDashboardWithResults,
  getRedashDashboardsByTag,
} from '@/lib/redash/client'
import { TRedashDashboard, TRedashQueryResponse } from '@/lib/redash/types'
import styles from './Analytics.module.scss'

const Analytics: FC<AnalyticsProps> = ({
  chainConfig,
  tag,
  params,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [dashboardsData, setDashboardsData] = useState<Array<{
    dashboard: TRedashDashboard
    queries: Record<number, TRedashQueryResponse>
  }> | null>(null)

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

      const dashboardResults: Array<{
        dashboard: TRedashDashboard
        queries: Record<number, TRedashQueryResponse>
      }> = []

      await Promise.all(
        dashboardsList?.results?.map(async (dashboard) => {
          dashboardResults.push(
            await getRadashDashboardWithResults(dashboard.id, params)
          )
        })
      )

      setDashboardsData(dashboardResults)
    }

    getData()
  }, [isMounted])

  if (!dashboardsData?.length) {
    return <LoadingCard />
  }

  const tabs = dashboardsData?.map(({ dashboard, queries }) => {
    return {
      title: dashboard.name,
      value: dashboard.id,
      content: (
        <Dashboard
          {...dashboard}
          queriesResponse={queries}
          chainConfig={chainConfig}
        />
      ),
    }
  })

  return (
    <Card className={clsx(styles.container, className)}>
      <TabPanel tabs={tabs} value={dashboardsData[0]?.dashboard.id || ''} />
    </Card>
  )
}

export default Analytics
