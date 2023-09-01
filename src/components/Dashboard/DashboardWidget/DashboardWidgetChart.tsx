import { CSSProperties, FC } from 'react'
import clsx from 'clsx'
import uniqolor from 'uniqolor'
import CommonChart from '@/components/CommonChart'
import HeatmapChart from '@/components/HeatmapChart'
import Loading from '@/components/Loading'
import Message from '@/components/Message'
import PieChart from '@/components/PieChart'
import {
  TRedashQueryResultData,
  TRedashVisualization,
} from '@/lib/redash/types'
import { financialFormat, formatAutoDetect } from '@/lib/utils'
import styles from './DashboardWidgetChart.module.scss'

const SUPPORTED_CHARTS = ['line', 'area', 'column', 'bar', 'pie', 'heatmap']

const tickFormatter = (value: string) =>
  formatAutoDetect(value, { number: { highPrecession: false } })

const DashboardWidgetChart: FC<{
  type: string
  data?: TRedashQueryResultData
  visualization: TRedashVisualization
  isLoading?: boolean
}> = ({ type, data, visualization: initialVisualization, isLoading }) => {
  if (!SUPPORTED_CHARTS.includes(type)) {
    return (
      <Message
        type="danger"
        text="This chart type is currently not supported"
      />
    )
  }

  const visualization = { ...initialVisualization }
  const columnMapping: Record<string, string[]> = { x: [], y: [], zVal: [] }

  Object.entries(visualization.options.columnMapping || {}).forEach(
    ([key, axis]) => {
      columnMapping[axis].push(key)
    }
  )

  if (type === 'heatmap') {
    const mapping = Object.fromEntries(
      Object.entries(visualization.options.columnMapping || {}).map(
        ([key, value]) => [value, key]
      )
    )

    const tooltipName = (visualization.options.seriesOptions || {})[mapping.y]
      ?.name

    if (isLoading) {
      return <Loading className={styles.loader} />
    }

    return (
      <HeatmapChart
        data={data?.rows}
        keys={{ x: mapping.x, y: mapping.y, val: mapping.zVal }}
        tickXFormatter={tickFormatter}
        tooltipFormat={({ x, y, value }) => {
          return `${
            tooltipName ? `${tooltipName} on ` : ''
          } ${x} ${y}: ${financialFormat(value)}`
        }}
      />
    )
  }

  if (type === 'pie') {
    return (
      <div
        className={clsx(
          styles.container,
          { [styles.loading]: isLoading },
          { [styles.empty]: !data?.rows?.length }
        )}
      >
        {isLoading && <Loading className={styles.loader} />}

        <div className={styles.wrapper}>
          <PieChart
            className={styles.chart}
            data={data?.rows || []}
            options={{
              dataKey: columnMapping.y[0],
              nameKey: columnMapping.x[0],
              formatter: (val) =>
                financialFormat(`${val}`, { highPrecession: true }),
            }}
          />
        </div>

        {visualization.options?.legend?.enabled && (
          <ul className={styles.legend}>
            {data?.rows.map((item, idx) => {
              return (
                <li
                  key={idx}
                  className={styles.entry}
                  style={
                    {
                      '--color': uniqolor(
                        `${item[columnMapping.x[0]] || ''}${idx}`
                      ).color,
                    } as CSSProperties
                  }
                >
                  <span className={styles.caption}>
                    {item[columnMapping.x[0]]}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  if (['line', 'area', 'column', 'bar'].includes(type)) {
    const entities: Record<
      string,
      { name: string; friendly_name: string; type: string }
    > =
      data?.columns?.reduce(
        (obj, curr) => ({ ...obj, [curr.name]: curr }),
        {}
      ) || {}

    const dataset = columnMapping.y.map((col, idx) => {
      const entity = entities[col]

      const entityTitle = visualization.options?.seriesOptions
        ? visualization.options?.seriesOptions[entity?.name]?.name
        : entity?.friendly_name || entity?.name

      return {
        id: col,
        data: data?.rows || [],
        color:
          visualization.options?.seriesOptions?.[entity?.name]?.color ||
          uniqolor(`${idx}-${col}`).color,
        name: entityTitle,
        key: entity?.name,
        className: `has-color ${entity?.name}`,
      }
    })

    return (
      <div
        className={clsx(
          styles.wrapper,
          { [styles.loading]: isLoading },
          { [styles.empty]: !data?.rows?.length }
        )}
      >
        {isLoading && <Loading className={styles.loader} />}

        <CommonChart
          className={styles.chart}
          type={type || 'line'}
          data={dataset}
          options={{
            zoom: true,
            axis: {
              x: {
                type: 'category',
                dataKey: columnMapping.x[0],
                axisLine: false,
                tickLine: false,
                tickFormatter,
              },
              y: {
                axisLine: false,
                tickLine: false,
                tickFormatter,
              },
            },
          }}
        />
      </div>
    )
  }

  return (
    <Message type="warn">
      Type &quot;{type}&quot; is not implemented yet
    </Message>
  )
}

export default DashboardWidgetChart
