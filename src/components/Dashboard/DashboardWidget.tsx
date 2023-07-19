import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { IconWatch, Table, Value } from '..'
import Card from '../Card'
import DashboardWidgetChart from './DashboardWidgetChart'
import DashboardWidgetCounter from './DashboardWidgetCounter'
import { DashboardWidgetData, DashboardWidgetQueryResult } from './types'
import IconRedash from '@/images/redash.svg'
import { financialFormat } from '@/lib/utils'
import styles from './Dashboard.module.scss'

const TimeAgo = dynamic(() => import('../TimeAgo'), { ssr: false })

const DashboardWidget: FC<
  DashboardWidgetData & { queryResult: DashboardWidgetQueryResult }
> = ({ options, visualization, text, queryResult }) => {
  const title = visualization ? (
    visualization?.type?.toLowerCase() !==
    visualization?.name?.toLowerCase() ? (
      <>{visualization?.name}</>
    ) : (
      visualization.query.name
    )
  ) : undefined

  return (
    <Card
      title={title}
      className={styles.widget}
      header={
        visualization?.query?.id ? (
          <Link
            data-tooltip-id="app-tooltip"
            data-tooltip-content={`Open ${visualization.query.name} query in Redash`}
            className={styles.redash}
            target="_blank"
            rel="noreferrer noopener"
            href={`${
              process.env.NEXT_PUBLIC_REDASH_API_URL ||
              'https://redash-demo.dex.guru'
            }/queries/${visualization.query.id}`}
          >
            <IconRedash className={styles.redashIcon} />
          </Link>
        ) : undefined
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
            queryResult?.data?.rows[(visualization.options.rowNumber || 1) - 1][
              visualization.options.counterColName || ''
            ]
          )}
          unit={visualization.options.counterLabel || visualization?.name}
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

      {visualization?.type === 'TABLE' && (
        <Table
          data={queryResult?.data?.rows}
          columns={queryResult?.data?.columns.map((col) => {
            return {
              accessor: col.name,
              title: col.friendly_name,
              type: ['integer', 'number'].includes(col.type)
                ? 'number'
                : 'text',
            }
          })}
        />
      )}
    </Card>
  )
}

export default DashboardWidget
