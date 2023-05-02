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
import { financialFormat } from '@/lib/utils'
import styles from './LineChart.module.scss'

const LineChart: FC<LineChartProps> = ({ data, series, className }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={clsx(styles.container, className)}
    >
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis
          yAxisId="left"
          orientation="left"
          tickFormatter={(value: number) => financialFormat(value)}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={(value: number) => financialFormat(value)}
        />
        <Tooltip />
        {series.map((el) => {
          return (
            <Line
              key={el.id}
              type="monotone"
              dataKey={el.id}
              stroke={el.color}
              dot={false}
              yAxisId={el.yAxis || 'left'}
            />
          )
        })}

        <Brush dataKey="label" />
      </Chart>
    </ResponsiveContainer>
  )
}

export default LineChart
