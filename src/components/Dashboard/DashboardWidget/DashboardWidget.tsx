import { ChangeEventHandler, FC, Suspense, useState } from 'react'
import { sanitize } from 'isomorphic-dompurify'
import { marked } from 'marked'
import useSWRImmutable from 'swr/immutable'
import styles from '../Dashboard.module.scss'
import DashboardWidgetChart from './DashboardWidgetChart'
import DashboardWidgetCounter from './DashboardWidgetCounter'
import DashboardWidgetTable from './DashboardWidgetTable'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { IconAgo, IconWarehouse, IconWatch } from '@/components/Icons'
import Message from '@/components/Message'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import {
  DYNAMIC_DATE_RANGES,
  DYNAMIC_DATE_PREFIX,
  getDynamicDateRangePeriod,
  DEFAULT_DATE_RANGE,
  DATETIME_FORMATS,
} from '@/lib/dates'
import {
  getRedashQueryResponse,
  generateRedashQueryParams,
} from '@/lib/redash/client'
import { TRedashJob, TRedashWidget } from '@/lib/redash/types'
import { financialFormat } from '@/lib/utils'

const WIDGET_QUERY_INTERVAL = 5 * 1000

const DashboardWidget: FC<{
  data: TRedashWidget
  params?: Record<string, unknown>
}> = ({ data: { options, visualization, text }, params }) => {
  const [currentDateRange, setCurrentDateRange] = useState(
    `${DYNAMIC_DATE_PREFIX}${DEFAULT_DATE_RANGE}`
  )
  const [queryActiveJob, setQueryActiveJob] = useState<TRedashJob | null>(null)

  const queryParams = visualization?.query
    ? generateRedashQueryParams(visualization?.query, {
        ...(params || {}),
        dates: getDynamicDateRangePeriod(
          currentDateRange,
          'datetime-range-with-seconds'
        ),
      })
    : null

  const swrKey = queryParams
    ? { id: visualization?.query?.id, params: queryParams }
    : null

  const isQueryActiveJob = !!queryActiveJob && queryActiveJob.status < 3

  const {
    data: queryResponse,
    isLoading: isLoadingResponse,
    error: errorResponse,
  } = useSWRImmutable(
    swrKey,
    ({ id, params }) =>
      getRedashQueryResponse(id, params).then((res) => {
        setQueryActiveJob(res?.job || null)
        return res
      }),
    {
      refreshInterval: () => (isQueryActiveJob ? WIDGET_QUERY_INTERVAL : 0),
    }
  )

  const queryJob = queryResponse?.job
  const queryResult = queryResponse?.query_result
  const isFetching = isLoadingResponse || isQueryActiveJob

  const title = visualization
    ? visualization?.type?.toLowerCase() !== visualization?.name?.toLowerCase()
      ? visualization?.name
      : visualization.query.name
    : undefined

  const renderWidgetVisualization = () => {
    if (visualization?.type === 'COUNTER') {
      return (
        <DashboardWidgetCounter
          isLoading={isFetching}
          value={financialFormat(
            queryResult?.data?.rows[(visualization.options.rowNumber || 1) - 1][
              visualization.options.counterColName || ''
            ] || ''
          )}
          unit={visualization.options.counterLabel}
        />
      )
    }

    if (visualization?.type === 'CHART') {
      return (
        <DashboardWidgetChart
          isLoading={isFetching}
          type={visualization.options?.globalSeriesType || 'unknown'}
          visualization={visualization}
          data={queryResult?.data}
        />
      )
    }

    if (visualization?.type === 'TABLE') {
      return (
        <DashboardWidgetTable data={queryResult?.data} isLoading={isFetching} />
      )
    }

    if (visualization?.type) {
      return (
        <Message type="danger">
          Visualization type {visualization.type} is not supported yet
        </Message>
      )
    }

    return null
  }

  const renderWidgetFooter = () => {
    return (
      <div className={styles.footer}>
        {isFetching && !queryJob?.id && (
          <Value
            className={styles.footer}
            icon={<IconWatch />}
            value={'Querying data'}
          />
        )}

        {isFetching && !!queryJob?.id && (
          <Value
            className={styles.timestamp}
            icon={<IconWatch />}
            value={!errorResponse ? 'Calculating data' : 'Query failed...'}
          />
        )}

        {!isFetching && !!queryResult?.retrieved_at && (
          <Value
            className={styles.timestamp}
            icon={<IconAgo />}
            value={
              <Suspense fallback={<>&nbsp;</>}>
                <TimeAgo
                  timestamp={
                    new Date(queryResult?.retrieved_at).getTime() / 1000
                  }
                />
              </Suspense>
            }
          />
        )}

        {renderDateRangeSwitch()}
      </div>
    )
  }

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setCurrentDateRange(e.target.value)
  }

  const renderDateRangeSwitch = () => {
    if (
      !visualization?.query?.options?.parameters?.find((param) =>
        Object.keys(DATETIME_FORMATS).includes(param.type)
      )
    ) {
      return undefined
    }

    return (
      <select value={currentDateRange} onChange={handleChange}>
        {Object.entries(DYNAMIC_DATE_RANGES).map(([key, value]) => {
          return (
            <option key={key} value={`${DYNAMIC_DATE_PREFIX}${key}`}>
              {value.name}
            </option>
          )
        })}
      </select>
    )
  }

  const tools = visualization?.query?.id ? (
    <Button
      icon={<IconWarehouse />}
      caption="SQL query"
      data-tooltip-id="app-tooltip"
      data-tooltip-content={`Open ${visualization.query.name} query in Warehouse`}
      className={styles.warehouse}
      target="_blank"
      rel="noreferrer noopener"
      href={`${process.env.NEXT_PUBLIC_REDASH_URL}/queries/${visualization.query.id}`}
    />
  ) : undefined

  return (
    <Card
      title={title}
      className={styles.widget}
      header={tools}
      style={{
        gridColumn: `${options?.position.col + 1} / span ${
          options?.position.sizeX
        }`,
        gridRow: `${options?.position.row + 1} / span ${
          options?.position.sizeY
        }`,
      }}
      footer={visualization ? renderWidgetFooter() : undefined}
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
            __html: sanitize(
              marked.parse(text, { mangle: false, headerIds: false })
            ),
          }}
        />
      )}

      {renderWidgetVisualization()}
    </Card>
  )
}

export default DashboardWidget
