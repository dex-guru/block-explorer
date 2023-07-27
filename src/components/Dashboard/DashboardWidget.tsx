import { ChangeEventHandler, FC, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { sanitize } from 'isomorphic-dompurify'
import { marked } from 'marked'
import { useIntervalWhen } from 'rooks'
import DashboardWidgetChart from './DashboardWidgetChart'
import DashboardWidgetCounter from './DashboardWidgetCounter'
import Card from '@/components/Card'
import { IconAgo, IconRedash, IconWatch } from '@/components/Icons'
import Message from '@/components/Message'
import Table from '@/components/Table'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import {
  DYNAMIC_DATE_RANGES,
  DYNAMIC_DATE_PREFIX,
  getDynamicDateRangePeriod,
} from '@/lib/dates'
import {
  getRedashJob,
  getRedashQueryResponse,
  generateRedashQueryParams,
} from '@/lib/redash/client'
import { TRedashQueryResponse, TRedashWidget } from '@/lib/redash/types'
import { financialFormat } from '@/lib/utils'
import styles from './Dashboard.module.scss'

const DashboardWidget: FC<{
  data: TRedashWidget
  queryResponse: TRedashQueryResponse
  params?: Record<string, unknown>
}> = ({ data: { options, visualization, text }, queryResponse, params }) => {
  const [queryResult, setQueryResult] = useState(queryResponse?.query_result)
  const [queryJob, setQueryJob] = useState(queryResponse?.job)
  const [currentDateRange, setCurrentDateRange] = useState('d_last_30_days')

  const getQueryData = () => {
    const getData = async () => {
      if (!visualization?.query?.id) {
        return
      }

      const queryParams = generateRedashQueryParams(visualization.query, {
        ...(params || {}),
        dates: getDynamicDateRangePeriod(currentDateRange),
      })

      const queryData = await getRedashQueryResponse(
        visualization?.query?.id,
        queryParams
      )

      setQueryResult(queryData.query_result)
      setQueryJob(queryData.job)
    }

    getData()
  }

  useEffect(() => {
    if (queryResult) {
      return
    }

    getQueryData()
  }, [currentDateRange])

  useIntervalWhen(
    () => {
      const getJob = async () => {
        if (!queryJob?.id) {
          return
        }

        const jobData = await getRedashJob(queryJob.id)

        if (!jobData?.job?.query_result_id) {
          return
        }

        getQueryData()
      }

      getJob()
    },
    5 * 1000,
    !!queryJob?.id,
    true
  )

  const title = visualization ? (
    visualization?.type?.toLowerCase() !==
    visualization?.name?.toLowerCase() ? (
      <>{visualization?.name}</>
    ) : (
      visualization.query.name
    )
  ) : undefined

  const isFetching =
    (!!queryJob?.status && queryJob?.status < 3) || (!queryJob && !queryResult)

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
        <Table
          data={queryResult?.data?.rows || []}
          columns={
            queryResult?.data?.columns.map((col) => {
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
        {!queryJob && !queryResult && (
          <Value
            className={styles.footer}
            icon={<IconWatch />}
            value={'Querying data'}
          />
        )}

        {!!queryJob?.status && (
          <Value
            className={styles.timestamp}
            icon={<IconWatch />}
            value={
              queryJob?.status < 3 ? 'Calculating data' : 'Query failed...'
            }
          />
        )}

        {!queryJob?.status && !!queryResult?.retrieved_at && (
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
    setQueryResult(undefined)
    setQueryJob(undefined)
    setCurrentDateRange(e.target.value)
  }

  const renderDateRangeSwitch = () => {
    if (
      !visualization?.query?.options?.parameters?.find(
        (param) => param.type === 'date-range'
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
    <Link
      data-tooltip-id="app-tooltip"
      data-tooltip-content={`Open ${visualization.query.name} query in Redash`}
      className={styles.redash}
      target="_blank"
      rel="noreferrer noopener"
      href={`${
        process.env.NEXT_PUBLIC_REDASH_API_URL || 'https://redash-demo.dex.guru'
      }/queries/${visualization.query.id}`}
    >
      <IconRedash className={styles.redashIcon} />
    </Link>
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
