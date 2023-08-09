import { FC } from 'react'
import clsx from 'clsx'
import {
  Brush,
  AreaChart,
  BarChart,
  Bar,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
} from 'recharts'
import TooltipContent from '../TooltipContent'
import { CommonChartDataset, CommonChartProps } from './types'
import { generateCommonChartData } from './utils'
import styles from './CommonChart.module.scss'

const getYAxisLabelsWidth = (
  data: CommonChartDataset[],
  tickFormatter?: (value: unknown, idx: number) => string
): number => {
  const width = Math.max(
    0,
    ...data.map((axisData) =>
      Math.max(
        0,
        ...axisData.data.map(
          (item) =>
            (!!tickFormatter
              ? tickFormatter(item[axisData.key || 'value'], 0) || ''
              : `${item[axisData.key || 'value']}`
            ).length
        )
      )
    )
  )

  return width
}

const CommonChart: FC<CommonChartProps> = ({
  data,
  className,
  type = 'line',
  options,
}) => {
  const chartData = generateCommonChartData(data, options.axis.x.dataKey)

  let Chart

  switch (type) {
    case 'area':
      Chart = AreaChart
      break
    case 'bar':
    case 'column':
      Chart = BarChart
      break
    default:
      Chart = LineChart
  }

  const renderedSeries = data.map((el) => {
    const params = {
      className: clsx(styles.line, el.className),
      name: el.name || el.id,
      dataKey: el.id || 'value',
      stroke: el.color,
      fill: el.color,
      dot: false,
      yAxisId: el.yAxis || 'left',
      isAnimationActive: options?.isAnimated ?? false,
    }

    switch (type) {
      case 'bar':
      case 'column':
        return <Bar key={el.id} {...params} />
      case 'area':
        return <Area key={el.id} {...params} type={el.type || 'monotone'} />
      default:
        return <Line key={el.id} {...params} type={el.type || 'monotone'} />
    }
  })

  const CommonChartTooltip: FC<{
    active?: boolean
    label?: unknown
    payload?: {
      value?: unknown
      stroke?: string
      name?: string
    }[]
  }> = ({ active, payload, label }) => {
    if (active && payload?.length) {
      const yFormatter = options?.axis?.y?.tickFormatter
      const xFormatter = options?.axis?.x?.tickFormatter

      const tooltipTitle = xFormatter ? xFormatter(label, 0) : label

      return (
        <TooltipContent
          title={`${tooltipTitle}`}
          entries={payload.map((item) => {
            const resultValue = yFormatter
              ? yFormatter(item.value, 0)
              : item.value

            return {
              title: item.name,
              value: `${resultValue}`,
              color: item.stroke,
            }
          })}
        />
      )
    }

    return null
  }

  const leftAxisData = data.filter((el) => el.yAxis !== 'right')
  const rightAxisData = data.filter((el) => el.yAxis === 'right')

  const hasLeftAxis = !!leftAxisData.length
  const hasRightAxis = !!rightAxisData.length

  const leftAxisWidth = getYAxisLabelsWidth(
    leftAxisData,
    options?.axis?.y?.tickFormatter
  )
  const rightAxisWidth = getYAxisLabelsWidth(
    rightAxisData,
    options?.axis?.y?.tickFormatter
  )

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={clsx(styles.container, className)}
    >
      <Chart data={chartData} className={styles.chart}>
        {!!options?.grid && <CartesianGrid className={styles.grid} />}

        <XAxis
          type={options?.axis.x.type || 'category'}
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
              'yAxis',
              'yAxis-left',
              styles.axisY,
              styles.axisYLeft,
              options?.axis?.y?.className
            )}
            yAxisId="left"
            orientation="left"
            width={leftAxisWidth * 7}
          />
        )}
        {hasRightAxis && (
          <YAxis
            {...options?.axis?.y}
            className={clsx(
              'yAxis',
              'yAxis-right',
              styles.axisY,
              styles.axisYRight,
              options?.axis?.y?.className
            )}
            yAxisId="right"
            orientation="right"
            width={rightAxisWidth * 7}
          />
        )}
        <Tooltip content={<CommonChartTooltip />} />

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

export default CommonChart
