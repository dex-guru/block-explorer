import { FC } from 'react'
import clsx from 'clsx'
import Loading from './Loading'
import Card from '@/components/Card'
import styles from './Loading.module.scss'

const LoadingCard: FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={clsx(styles.card, className)}>
      <Loading className={styles.loader} />
    </Card>
  )
}

export default LoadingCard
