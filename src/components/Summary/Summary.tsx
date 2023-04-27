import { FC } from 'react'
import Card from '../Card'
import Chart from '../Chart'
import Tile from '../Tile'
import { SummaryProps } from './types'
import styles from './Summary.module.scss'

const Summary: FC<SummaryProps> = ({ stats, charts, children }) => {
  const renderCharts = () => {
    return charts?.map((chart, index) => {
      return <Chart key={index} {...chart} />
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
          <div className={styles.stats}>{renderStats()}</div>
          <div className={styles.charts}>{renderCharts()}</div>
        </div>
        {Boolean(children) && <div className={styles.body}>{children}</div>}
      </div>
    </Card>
  )
}

export default Summary
