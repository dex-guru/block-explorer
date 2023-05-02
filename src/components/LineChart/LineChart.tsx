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

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={clsx(styles.container, className)}
    >
      <Chart data={data} className={styles.chart}>
        <CartesianGrid
          className={styles.grid}
          horizontal={options?.grid?.horizontal}
          vertical={options?.grid?.vertical}
        />
        <XAxis
          dataKey="label"
          className={styles.axisX}
          tickFormatter={options?.axis?.x?.tickFormatter}
        />
        <YAxis
          className={clsx(styles.axisY, styles.axisYLeft)}
          yAxisId="left"
          orientation="left"
          tickFormatter={options?.axis?.y?.tickFormatter}
        />
        <YAxis
          className={clsx(styles.axisY, styles.axisYRight)}
          yAxisId="right"
          orientation="right"
          tickFormatter={options?.axis?.y?.tickFormatter}
        />
        <Tooltip
          labelClassName={styles.tooltipLabel}
          wrapperClassName={styles.tooltip}
        />

        {renderedSeries}

        <Brush
          dataKey="label"
          className={styles.zoom}
          tickFormatter={options?.axis?.x?.tickFormatter}
        >
          <Chart data={data}>{renderedSeries}</Chart>
        </Brush>
      </Chart>
    </ResponsiveContainer>
  )
}

export default LineChart
