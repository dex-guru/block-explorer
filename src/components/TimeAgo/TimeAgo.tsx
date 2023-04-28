import { FC } from 'react'
import clsx from 'clsx'
import { formatTime } from './helpers'
import { TimeAgoProps } from './types'
import styles from './TimeAgo.module.scss'

const TimeAgo: FC<TimeAgoProps> = ({ timestamp, className }) => {
  if (!timestamp) {
    return null
  }

  const dueDate = new Date(timestamp * 1000)
  const seconds = Math.floor((new Date().getTime() - dueDate.getTime()) / 1000)

  const suffix = seconds < 0 ? 'to go' : 'ago'

  return (
    <span
      className={clsx(styles.container, className)}
      data-tooltip-id="app-tooltip"
      data-tooltip-content={dueDate.toUTCString()}
    >
      {formatTime(Math.abs(seconds))} {suffix}
    </span>
  )
}

export default TimeAgo
