import { FC, ReactNode } from 'react'
import { Loading } from '..'
import clsx from 'clsx'
import styles from './Dashboard.module.scss'

const DashboardWidgetCounter: FC<{
  value: ReactNode
  unit?: ReactNode
  isLoading?: boolean
}> = ({ value, unit, isLoading }) => {
  return (
    <div className={clsx(styles.counter, { [styles.loading]: isLoading })}>
      {isLoading && <Loading className={styles.loader} />}
      <span className={styles.value}>{value || <>&nbsp;</>}</span>{' '}
      <span className={styles.unit}>{unit || <>&nbsp;</>}</span>
    </div>
  )
}

export default DashboardWidgetCounter
