import { CSSProperties, FC } from 'react'

import clsx from 'clsx'
import uniqolor from 'uniqolor'

import HeatmapChart from '@/components/HeatmapChart'
import Loading from '@/components/Loading'
import Message from '@/components/Message'
import PieChart from '@/components/PieChart'
import { TRedashQueryResultData, TRedashVisualization } from '@/lib/redash/types'
import { financialFormat, formatAutoDetect } from '@/lib/utils'

import { ChartSeries, DashboardWidgetChartRenderer } from './DashboardWidgetChartRenderer'

import styles from './DashboardWidgetChart.module.scss'

const SUPPORTED_CHARTS = ['line', 'area', 'column', 'bar', 'pie', 'heatmap', 'scatter']

const tickFormatter = (value: string) =>
  formatAutoDetect(value, { number: { highPrecession: false } })

const DashboardWidgetChart: FC<{
  type: string
  data?: TRedashQueryResultData
  visualization: TRedashVisualization
  isLoading?: boolean
}> = ({ type, data, visualization, isLoading }) => {
  if (!SUPPORTED_CHARTS.includes(type)) {
    return <Message type="danger" text="This chart type is currently not supported" />
  }

  if (type === 'heatmap') {
    const mapping = Object.fromEntries(
      Object.entries(visualization.options.columnMapping || {}).map(([key, value]) => [value, key])
    )

    const tooltipName = (visualization.options.seriesOptions || {})[mapping.y]?.name

    return (
      <div
        className={clsx(
          styles.container,
          { [styles.loading]: isLoading },
          { [styles.empty]: !data?.rows?.length }
        )}>
        {isLoading && <Loading className={styles.loader} />}

        <div className={styles.wrapper}>
          <HeatmapChart
            className={styles.heatmap}
            data={data?.rows}
            keys={{ x: mapping.x, y: mapping.y, val: mapping.zVal }}
            tickXFormatter={tickFormatter}
            tooltipFormat={({ x, y, value }) => {
              return `${tooltipName ? `${tooltipName} on ` : ''} ${x} ${y}: ${financialFormat(
                value
              )}`
            }}
          />
        </div>
      </div>
    )
  }

  if (type === 'pie') {
    const mapping = Object.fromEntries(
      Object.entries(visualization.options.columnMapping || {}).map(([key, value]) => [value, key])
    )

    return (
      <div
        className={clsx(
          styles.container,
          { [styles.loading]: isLoading },
          { [styles.empty]: !data?.rows?.length }
        )}>
        {isLoading && <Loading className={styles.loader} />}

        <div className={styles.wrapper}>
          <PieChart
            className={styles.chart}
            data={data?.rows || []}
            options={{
              dataKey: mapping.y,
              nameKey: mapping.x,
              formatter: (val) => financialFormat(`${val}`, { highPrecession: true }),
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
                      '--color': uniqolor(`${item[mapping.x] || ''}${idx}`).color,
                    } as CSSProperties
                  }>
                  <span className={styles.caption}>{item[mapping.x]}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    )
  }

  if (['line', 'area', 'column', 'bar', 'scatter'].includes(type)) {
    const xKey =
      Object.entries(visualization.options.columnMapping || {}).find(
        ([, value]) => value === 'x'
      )?.[0] || 'x'

    const dataSeries: ChartSeries[] = (data?.columns || [])
      ?.filter((column) => {
        return visualization.options.columnMapping?.[column.name] === 'y'
      })
      .map((column) => {
        const id = visualization.options.seriesOptions?.[column.name]?.yAxis || 0
        return {
          key: column.name,
          type: visualization.options.seriesOptions?.[column.name]?.type ?? type,
          name:
            visualization.options.seriesOptions?.[column.name]?.name ??
            column.friendly_name ??
            column.name,
          yAxis: {
            id: `yAxis${id}`,
            orientation: visualization.options.yAxis[id].opposite ? 'right' : 'left',
            type: visualization.options.yAxis[id].type === 'category' ? 'category' : 'number',
          },
          color:
            visualization.options.seriesOptions?.[column.name]?.color ??
            uniqolor(column.name).color,
        }
      })

    return (
      <div
        className={clsx(
          styles.wrapper,
          { [styles.loading]: isLoading },
          { [styles.empty]: !data?.rows?.length }
        )}>
        {isLoading && <Loading className={styles.loader} />}

        <DashboardWidgetChartRenderer
          className={styles.chart}
          series={Object.values(dataSeries)}
          data={data?.rows}
          options={{
            zoom: true,
            axis: {
              x: {
                type: 'category',
                dataKey: xKey,
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

  return <Message type="warn">Type &quot;{type}&quot; is not implemented yet</Message>
}

export default DashboardWidgetChart
