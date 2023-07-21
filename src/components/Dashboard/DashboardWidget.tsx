import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { IconWatch, Loading, Table, Value } from '..'
import { marked } from 'marked'
import Card from '../Card'
import DashboardWidgetChart from './DashboardWidgetChart'
import DashboardWidgetCounter from './DashboardWidgetCounter'
import IconRedash from '@/images/redash.svg'
import { TRedashQueryResponse, TRedashWidget } from '@/lib/redash/types'
import { financialFormat } from '@/lib/utils'
import styles from './Dashboard.module.scss'

const TimeAgo = dynamic(() => import('../TimeAgo'), { ssr: false })

const DashboardWidget: FC<TRedashWidget & { query: TRedashQueryResponse }> = ({
  options,
  visualization,
  text,
  query,
}) => {
  const title = visualization ? (
    visualization?.type?.toLowerCase() !==
    visualization?.name?.toLowerCase() ? (
      <>{visualization?.name}</>
    ) : (
      visualization.query.name
    )
  ) : undefined

  const renderWidgetVisualization = () => {
    if (visualization?.type === 'COUNTER') {
      return (
        <DashboardWidgetCounter
          isLoading={!!query?.job?.id}
          value={financialFormat(
            query?.query_result?.data?.rows[
              (visualization.options.rowNumber || 1) - 1
            ][visualization.options.counterColName || ''] || ''
          )}
          unit={visualization.options.counterLabel}
        />
      )
    }

    if (visualization?.type === 'CHART') {
      return (
        <DashboardWidgetChart
          isLoading={!!query?.job?.id}
          type={visualization.options?.globalSeriesType || 'unknown'}
          visualization={visualization}
          data={query?.query_result?.data}
        />
      )
    }

    if (visualization?.type === 'TABLE') {
      return (
        <Table
          data={query?.query_result?.data?.rows || []}
          columns={
            query?.query_result?.data?.columns.map((col) => {
              return {
                accessor: col.name,
                title: col.friendly_name,
                type: ['integer', 'number'].includes(col.type)
                  ? 'number'
                  : 'text',
              }
            }) || []
          }
        />
      )
    }

    return <></>
  }

  const renderWidgetFooter = () => {
    if (!!query?.job?.id) {
      return (
        <Value
          className={styles.footer}
          icon={<IconWatch />}
          value={'Query is in progress'}
        />
      )
    }

    if (query?.query_result?.retrieved_at) {
      return (
        <Value
          className={styles.footer}
          icon={<IconWatch />}
          value={
            <>
              <Suspense fallback={<>&nbsp;</>}>
                <TimeAgo
                  timestamp={
                    new Date(query.query_result?.retrieved_at).getTime() / 1000
                  }
                />
              </Suspense>
            </>
          }
        />
      )
    }

    return undefined
  }

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
      footer={renderWidgetFooter()}
    >
      {!!visualization?.query?.description && (
        <div className={styles.description}>
          {visualization.query.description}
        </div>
      )}

      {!!text && (
        <div
          className="text"
          dangerouslySetInnerHTML={{
            __html: marked.parse(text, { mangle: false, headerIds: false }),
          }}
        />
      )}

      {renderWidgetVisualization()}

      {!!query?.job?.id && <Loading className={styles.loader} />}
    </Card>
  )
}

export default DashboardWidget
