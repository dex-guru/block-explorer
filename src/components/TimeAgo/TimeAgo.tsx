import { FC } from 'react'
import clsx from 'clsx'
import { formatTime } from './helpers'
import { TimeAgoProps } from './types'
import styles from './TimeAgo.module.scss'

const TimeAgo: FC<TimeAgoProps> = ({
  timestamp,
  className,
  showTooltip = true,
}) => {
  if (!timestamp) {
    return null
  }

  const dueDate = new Date(timestamp * 1000)
  const seconds = Math.floor((new Date().getTime() - dueDate.getTime()) / 1000)

  const suffix = seconds < 0 ? 'to go' : 'ago'

  const tooltipData = showTooltip
    ? {
        'data-tooltip-id': 'app-tooltip',
        'data-tooltip-content': `${dueDate.toLocaleString('en-GB', {
          timeZone: 'UTC',
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          weekday: 'short',
          hour12: false,
        })} UTC`,
      }
    : {}

  return (
    <span className={clsx(styles.container, className)} {...tooltipData}>
      {formatTime(Math.abs(seconds))} {suffix}
    </span>
  )
}

export default TimeAgo
