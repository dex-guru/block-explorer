import { FC } from 'react'
import styles from './Dashboard.module.scss'

const DashboardWidgetCounter: FC<{ value: string; unit: string }> = ({
  value,
  unit,
}) => {
  return (
    <div className={styles.counter}>
      <span className={styles.value}>{value}</span>{' '}
      <span className={styles.unit}>{unit}</span>
    </div>
  )
}

export default DashboardWidgetCounter
