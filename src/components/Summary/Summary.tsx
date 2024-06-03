import { FC } from 'react'

import Card from '@/components/Card'
import CommonChart from '@/components/CommonChart'
import Tile from '@/components/Tile'
import TooltipAnchor from '@/components/TooltipAnchor'
import { financialFormat, getShortDate } from '@/lib/utils'

import Button from '../Button'
import { SummaryProps } from './types'

import styles from './Summary.module.scss'

const Summary: FC<SummaryProps> = ({ title, stats, charts, children }) => {
  const renderCharts = () => {
    return charts?.map((chart, index) => {
      return (
        <Tile
          key={index}
          prefix={
            <div className={styles.header}>
              {chart.title}{' '}
              {chart.url ? (
                <Button className={styles.link} caption="Network Activities" href={chart.url} />
              ) : null}
            </div>
          }
          className={styles.chartTile}>
          <div className={styles.chart}>
            <CommonChart
              className={chart.className}
              data={chart.data}
              options={{
                axis: {
                  x: {
                    dataKey: 'timestamp',
                    type: 'number',
                    tickFormatter: (value: number) => getShortDate(value),
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
            <div key={index} className={styles.tile}>
              <strong className={styles.tileTitle}>
                {stat.title} {!!stat.tooltip && <TooltipAnchor tooltip={stat.tooltip} />}
              </strong>{' '}
              <span className={styles.tileValue}>{stat.value}</span>
            </div>
          )
        })}
      </ul>
    )
  }

  return (
    <Card title={title}>
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
