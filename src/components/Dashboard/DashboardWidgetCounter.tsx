import { FC } from 'react'
import clsx from 'clsx'
import styles from './Dashboard.module.scss'

const DashboardWidgetCounter: FC<{
  value: string
  unit?: string
  isLoading?: boolean
}> = ({ value, unit, isLoading }) => {
  return (
    <div className={clsx(styles.counter, { [styles.loading]: isLoading })}>
      <span className={styles.value}>{value}</span>{' '}
      <span className={styles.unit}>{unit || <>&nbsp;</>}</span>
    </div>
  )
}

export default DashboardWidgetCounter
