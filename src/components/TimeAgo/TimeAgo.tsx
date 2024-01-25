import { FC } from 'react'

import clsx from 'clsx'

import { getDateTime } from '@/lib/dates'

import { formatTime } from './helpers'
import { TimeAgoProps } from './types'

import styles from './TimeAgo.module.scss'

const TimeAgo: FC<TimeAgoProps> = ({ timestamp, className, showTooltip = true }) => {
  if (!timestamp) {
    return null
  }

  const dueDate = new Date(timestamp * 1000)
  const seconds = Math.floor((new Date().getTime() - dueDate.getTime()) / 1000)

  const suffix = seconds < 0 ? 'to go' : 'ago'

  const tooltipData = showTooltip
    ? {
        'data-tooltip-id': 'app-tooltip',
        'data-tooltip-content': `${getDateTime(dueDate)} UTC`,
      }
    : {}

  return (
    <span className={clsx(styles.container, className)} {...tooltipData}>
      {formatTime(Math.abs(seconds))} {suffix}
    </span>
  )
}

export default TimeAgo
