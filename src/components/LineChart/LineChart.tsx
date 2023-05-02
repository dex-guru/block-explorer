import { FC } from 'react'
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
import { LineChartProps } from './types'
import styles from './LineChart.module.scss'

const LineChart: FC<LineChartProps> = ({
  data,
  series,
  className,
  options,
}) => {
  const renderedSeries = series.map((el) => {
    return (
      <Line
        className={clsx(styles.line, el.className)}
        key={el.id}
        type="monotone"
        dataKey={el.id}
        stroke={el.color}
        dot={false}
        yAxisId={el.yAxis || 'left'}
      />
    )
  })

  const hasLeftAxis = series.filter((el) => el.yAxis !== 'right')
  const hasRightAxis = series.filter((el) => el.yAxis === 'right')

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={clsx(styles.container, className)}
    >
      <Chart data={data} className={styles.chart} height={100} width={100}>
        {options?.grid && <CartesianGrid className={styles.grid} />}

        <XAxis dataKey="label" className={styles.axisX} {...options?.axis?.x} />

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
        <Tooltip
          labelClassName={styles.tooltipLabel}
          wrapperClassName={styles.tooltip}
        />

        {renderedSeries}

        {options?.zoom && (
          <Brush
            dataKey="label"
            className={styles.zoom}
            tickFormatter={options?.axis?.x?.tickFormatter}
          >
            <Chart data={data}>{renderedSeries}</Chart>
          </Brush>
        )}
      </Chart>
    </ResponsiveContainer>
  )
}

export default LineChart
