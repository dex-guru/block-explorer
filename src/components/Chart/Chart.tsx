import { FC } from 'react'
import clsx from 'clsx'
import Heading from '../Heading'
import LineChart from '../LineChart'
import { generateLineChartData } from '../LineChart/utils'
import { ChartProps } from './types'
import { financialFormat } from '@/lib/utils'
import styles from './Chart.module.scss'

const Chart: FC<ChartProps> = ({ title, data, className }) => {
  if (!data?.length) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      {!!title && (
        <div className={styles.header}>
          <Heading size="xs" caption={title} className={styles.title} />
        </div>
      )}
      <div className={styles.body}>
        <LineChart
          className={styles.chart}
          data={generateLineChartData(data)}
          series={data}
          options={{
            axis: {
              x: {
                tickFormatter: (value: number) => {
                  const date = new Date(value * 1000)
                  return date.toLocaleDateString('en-GB', {
                    timeZone: 'UTC',
                    month: 'short',
                    year: '2-digit',
                    day: '2-digit',
                  })
                },
                axisLine: false,
                tickLine: false,
              },
              y: {
                tickFormatter: (value: number) =>
                  financialFormat(value, { roundBigNumbersFrom: 'K' }),
                axisLine: false,
                tickLine: false,
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default Chart
