import { FC } from 'react'
import Card from '../Card'
import LineChart from '../LineChart'
import Tile from '../Tile'
import TooltipAnchor from '../TooltipAnchor'
import { SummaryProps } from './types'
import { financialFormat, getShortDate } from '@/lib/utils'
import styles from './Summary.module.scss'

const Summary: FC<SummaryProps> = ({ stats, charts, children }) => {
  const renderCharts = () => {
    return charts?.map((chart, index) => {
      return (
        <Tile key={index} prefix={chart.title} className={styles.chartTile}>
          <div className={styles.chart}>
            <LineChart
              className={chart.className}
              data={chart.data}
              options={{
                axis: {
                  x: {
                    dataKey: 'timestamp',
                    type: 'number',
                    tickFormatter: getShortDate,
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
        </Tile>
      )
    })
  }

  const renderStats = () => {
    return (
      <ul className={styles.statsList}>
        {stats?.map((stat, index) => {
          return (
            <Tile
              key={index}
              prefix={
                <>
                  {stat.title} <TooltipAnchor tooltip={stat.tooltip} />
                </>
              }
              title={stat.value}
              className={styles.tile}
            />
          )
        })}
      </ul>
    )
  }

  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.body}>
          {!!stats && <div className={styles.stats}>{renderStats()}</div>}
          {!!charts && <div className={styles.charts}>{renderCharts()}</div>}
        </div>
        {!!children && <div className={styles.body}>{children}</div>}
      </div>
    </Card>
  )
}

export default Summary
