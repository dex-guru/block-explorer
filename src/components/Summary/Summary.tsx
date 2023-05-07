import { FC } from 'react'
import Card from '../Card'
import LineChart from '../LineChart'
import { generateLineChartData } from '../LineChart/utils'
import Tile from '../Tile'
import { SummaryProps } from './types'
import { financialFormat } from '@/lib/utils'
import styles from './Summary.module.scss'

const Summary: FC<SummaryProps> = ({ stats, charts, children }) => {
  const renderCharts = () => {
    return charts?.map((chart, index) => {
      return (
        <Tile key={index} prefix={chart.title} className={styles.chartTile}>
          <div className={styles.chart}>
            <LineChart
              className={chart.className}
              data={generateLineChartData(chart.data)}
              series={chart.data}
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
        </Tile>
      )
    })
  }

  const renderStats = () => {
    return stats?.map((stat, index) => {
      return <Tile key={index} prefix={stat.title} title={stat.value} />
    })
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
