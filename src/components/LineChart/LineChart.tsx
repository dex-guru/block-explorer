import { FC } from 'react'
import { LineChartProps } from '.'
import clsx from 'clsx'
import {
  Brush,
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Heading from '../Heading'
import { generateLineChartData } from './utils'
import styles from './LineChart.module.scss'

const LineChart: FC<LineChartProps> = ({ data, className, options }) => {
  const chartData = generateLineChartData(data, options.axis.x.dataKey)

  const renderedSeries = data.map((el) => {
    return (
      <Line
        className={clsx(styles.line, el.className)}
        name={el.name || el.id}
        key={el.id}
        type={el.type || 'monotone'}
        dataKey={el.id || 'value'}
        stroke={el.color}
        dot={false}
        yAxisId={el.yAxis || 'left'}
      />
    )
  })

  const LineChartTooltip: FC<{
    active?: boolean
    label?: unknown
    payload?: {
      value?: unknown
      stroke?: string
      name?: string
    }[]
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const yFormatter = options?.axis?.y?.tickFormatter
      const xFormatter = options?.axis?.x?.tickFormatter

      const tooltipTitle = xFormatter ? xFormatter(label, 0) : label

      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <Heading size="xs" caption={`${tooltipTitle}`} />
          </div>
          <div className={styles.tooltipBody}>
            <ul className={styles.tooltipList}>
              {payload.map((item, idx) => {
                const resultValue = yFormatter
                  ? yFormatter(item.value, 0)
                  : item.value

                return (
                  <li
                    key={idx}
                    className={styles.tooltipItem}
                    style={{ color: item.stroke }}
                  >
                    {payload.length > 1 ? `${item.name}: ` : ''}
                    {`${resultValue}`}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )
    }

    return null
  }

  const hasLeftAxis = data.filter((el) => el.yAxis !== 'right')
  const hasRightAxis = data.filter((el) => el.yAxis === 'right')

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={clsx(styles.container, className)}
    >
      <Chart data={chartData} className={styles.chart} height={100} width={100}>
        {!!options?.grid && <CartesianGrid className={styles.grid} />}

        <XAxis
          type={options?.axis.x.type}
          domain={['dataMin', 'dataMax']}
          {...options?.axis?.x}
          className={clsx(
            styles.axisX,
            styles.axisYLeft,
            options?.axis?.x?.className
          )}
        />

        {hasLeftAxis && (
          <YAxis
            {...options?.axis?.y}
            className={clsx(
              styles.axisY,
              styles.axisYLeft,
              options?.axis?.y?.className
            )}
            yAxisId="left"
            orientation="left"
          />
        )}
        {hasRightAxis && (
          <YAxis
            {...options?.axis?.y}
            className={clsx(
              styles.axisY,
              styles.axisYRight,
              options?.axis?.y?.className
            )}
            yAxisId="right"
            orientation="right"
          />
        )}
        <Tooltip content={<LineChartTooltip />} />

        {renderedSeries}

        {options?.zoom && (
          <Brush
            dataKey={options?.axis.x.dataKey}
            type={options.axis.x.type}
            className={styles.zoom}
            tickFormatter={options?.axis?.x?.tickFormatter}
          >
            <Chart data={chartData}>{renderedSeries}</Chart>
          </Brush>
        )}
      </Chart>
    </ResponsiveContainer>
  )
}

export default LineChart
