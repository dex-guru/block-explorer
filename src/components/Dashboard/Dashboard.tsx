import { FC, useMemo } from 'react'
import Link from 'next/link'
import DashboardAnalyzer from './DashboardAnalyzer'
import DashboardWidget from './DashboardWidget'
import DetailsView from '@/components/DetailsView'
import IconRedash from '@/images/redash.svg'
import {
  DEFAULT_DATE_RANGE,
  DYNAMIC_DATE_PREFIX,
  getDynamicDateRangePeriod,
} from '@/lib/dates'
import { generateRedashDashboardParams } from '@/lib/redash/client'
import { TRedashDashboard } from '@/lib/redash/types'
import styles from './Dashboard.module.scss'

const Dashboard: FC<{
  data: TRedashDashboard
  params?: Record<string, unknown>
}> = ({ data, params }) => {
  const { id, name, slug, widgets } = data
  const parameters = useMemo(
    () =>
      generateRedashDashboardParams(data, {
        ...(params || {}),
        dates: getDynamicDateRangePeriod(
          `${DYNAMIC_DATE_PREFIX}${DEFAULT_DATE_RANGE}`
        ),
      }),
    [data, params]
  )

  const sortedWidgets =
    widgets
      ?.filter((widget) => !widget.options.isHidden)
      .sort((a, b) => {
        const aPos = a.options.position.row * 100 + a.options.position.col
        const bPos = b.options.position.row * 100 + b.options.position.col

        return aPos - bPos
      }) || []

  return (
    <DetailsView
      title={name}
      header={
        <Link
          className={styles.redash}
          data-tooltip-id="app-tooltip"
          data-tooltip-content={`Open ${name} in Warehouse`}
          target="_blank"
          rel="noreferrer noopener"
          href={`${process.env.NEXT_PUBLIC_REDASH_URL}/dashboards/${id}-${slug}`}
        >
          <IconRedash className={styles.redashIcon} />
        </Link>
      }
    >
      <DashboardAnalyzer slug={data.slug} params={parameters} />

      <div className={styles.dashboard}>
        {sortedWidgets.map((widget) => (
          <DashboardWidget data={widget} params={parameters} key={widget.id} />
        ))}
      </div>
    </DetailsView>
  )
}

export default Dashboard
