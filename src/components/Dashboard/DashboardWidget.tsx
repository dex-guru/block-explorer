import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { IconWatch, Value } from '..'
import Card from '../Card'
import TooltipAnchor from '../TooltipAnchor'
import DashboardWidgetChart from './DashboardWidgetChart'
import DashboardWidgetCounter from './DashboardWidgetCounter'
import { DashboardWidgetData, DashboardWidgetQueryResult } from './types'
import { financialFormat } from '@/lib/utils'
import styles from './Dashboard.module.scss'

const TimeAgo = dynamic(() => import('../TimeAgo'), { ssr: false })

const DashboardWidget: FC<
  DashboardWidgetData & { queryResult: DashboardWidgetQueryResult }
> = ({ options, visualization, text, queryResult }) => {
  const title = visualization ? (
    visualization?.type?.toLowerCase() !==
    visualization?.name?.toLowerCase() ? (
      <>
        {visualization?.name}
        {visualization.query?.name &&
        visualization.name !== visualization.query?.name ? (
          <>
            {' '}
            <span className={styles.query}>
              &bull; {visualization.query.name}
            </span>
          </>
        ) : null}
      </>
    ) : (
      visualization.query.name
    )
  ) : undefined

  return (
    <Card
      title={title}
      className={styles.widget}
      header={
        <TooltipAnchor
          tooltip={
            <pre>{JSON.stringify(visualization?.query || {}, null, 2)}</pre>
          }
        />
      }
      style={{
        gridColumn: `${options?.position.col + 1} / span ${
          options?.position.sizeX
        }`,
        gridRow: `${options?.position.row + 1} / span ${
          options?.position.sizeY
        }`,
      }}
      footer={
        queryResult?.retrieved_at ? (
          <Value
            className={styles.footer}
            icon={<IconWatch />}
            value={
              <>
                <Suspense fallback={<>&nbsp;</>}>
                  <TimeAgo
                    timestamp={
                      new Date(queryResult.retrieved_at).getTime() / 1000
                    }
                  />
                </Suspense>
              </>
            }
          />
        ) : undefined
      }
    >
      {text}

      {visualization?.type === 'COUNTER' && (
        <DashboardWidgetCounter
          value={financialFormat(
            Object.values(queryResult?.data?.rows[0] || {})[0] || 0
          )}
          unit={visualization?.name}
        />
      )}

      {visualization?.type === 'CHART' && (
        <DashboardWidgetChart
          type={
            visualization.options?.globalSeriesType === 'pie' ? 'pie' : 'line'
          }
          visualization={visualization}
          data={queryResult?.data}
        />
      )}
    </Card>
  )
}

export default DashboardWidget
