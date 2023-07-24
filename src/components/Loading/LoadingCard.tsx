import { FC } from 'react'
import clsx from 'clsx'
import { Card, Loading } from '@/components'
import styles from './Loading.module.scss'

const LoadingCard: FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={clsx(styles.card, className)}>
      <Loading className={styles.loader} />
    </Card>
  )
}

export default LoadingCard
