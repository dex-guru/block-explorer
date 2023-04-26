import { FC } from 'react'
import Card from '../Card'
import Chart from '../Chart'
import { SummaryProps } from './types'
import styles from './Summary.module.scss'

const Summary: FC<SummaryProps> = ({ charts, children }) => {
  const renderCharts = () => {
    return charts?.map((chart) => {
      return <Chart {...chart} />
    })
  }

  return (
    <Card className={styles.container}>
      <div className={styles.body}>
        <div className={styles.charts}>{renderCharts()}</div>
      </div>
      {Boolean(children) && <div className={styles.body}>{children}</div>}
    </Card>
  )
}

export default Summary
