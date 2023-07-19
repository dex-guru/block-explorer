import { CSSProperties, FC } from 'react'
import clsx from 'clsx'
import {
  PieChart as Chart,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
} from 'recharts'
import uniqolor from 'uniqolor'
import { PieChartProps } from './types'
import { financialFormat } from '@/lib/utils'
import styles from './PieChart.module.scss'

const PieChart: FC<PieChartProps> = ({ data, className, options }) => {
  const PieChartTooltip: FC<{
    active?: boolean
    payload?: Array<
      {
        payload: {
          [key: string]: string
        }
      } & {
        [key: string]: string
      }
    >
  }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.tooltip}>
          <div className={styles.tooltipBody}>
            <ul className={styles.tooltipList}>
              {payload.map((item, idx) => {
                const resultValue = options.formatter
                  ? options.formatter(item.value, 0)
                  : item.value

                return (
                  <li key={idx} className={styles.tooltipItem}>
                    <strong
                      className={styles.tooltipEntry}
                      style={
                        {
                          '--color': uniqolor(
                            item.payload[options.nameKey] || ''
                          ).color,
                        } as CSSProperties
                      }
                    >
                      {item.payload[options.nameKey]}:
                    </strong>{' '}
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

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className={clsx(styles.container, className)}
    >
      <Chart className={styles.chart}>
        <Tooltip content={<PieChartTooltip />} />

        <Pie
          className={clsx(styles.pie)}
          data={data}
          dataKey={options.dataKey}
          innerRadius="40%"
          cx="50%"
          cy="50%"
          label={({ percent }) => `${financialFormat(percent * 100)}%`}
          labelLine
          isAnimationActive={false}
        >
          {data.map((el) => {
            return (
              <Cell
                className={styles.cell}
                fill={uniqolor(el[options?.nameKey || '']).color}
                key={el[options?.nameKey]}
              />
            )
          })}
        </Pie>
      </Chart>
    </ResponsiveContainer>
  )
}

export default PieChart
