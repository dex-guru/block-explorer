import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Loading from '@/components/Loading'
import styles from './DashboardWidget.module.scss'

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
