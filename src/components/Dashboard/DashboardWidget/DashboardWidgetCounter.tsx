import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import styles from '../Dashboard.module.scss'
import Loading from '@/components/Loading'

const DashboardWidgetCounter: FC<{
  value: ReactNode
  unit?: ReactNode
  isLoading?: boolean
}> = ({ value, unit, isLoading }) => {
  return (
    <div className={clsx(styles.counter, { [styles.loading]: isLoading })}>
      {isLoading && <Loading className={styles.loader} />}
      <span className={styles.value}>
        {value !== '' ? value : <span className={styles.muted}>&mdash;</span>}
      </span>{' '}
      <span className={styles.unit}>{unit || <>&nbsp;</>}</span>
    </div>
  )
}

export default DashboardWidgetCounter
