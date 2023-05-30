import { FC } from 'react'
import clsx from 'clsx'
import styles from './Loading.module.scss'

const Loading: FC<{ className?: string }> = ({ className }) => {
  return <progress className={clsx(styles.progress, className)} />
}

export default Loading
