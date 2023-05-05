import { FC } from 'react'
import clsx from 'clsx'
import Card from '../Card'
import Loading from './Loading'
import styles from './Loading.module.scss'

const LoadingCard: FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={clsx(styles.card, className)}>
      <Loading />
    </Card>
  )
}

export default LoadingCard
