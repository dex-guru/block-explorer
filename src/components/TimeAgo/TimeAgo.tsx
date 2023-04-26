import { FC } from 'react'
import { formatTime } from './helpers'
import { TimeAgoProps } from './types'

const TimeAgo: FC<TimeAgoProps> = ({ timestamp, className }) => {
  if (!timestamp) {
    return null
  }

  const dueDate = new Date(timestamp * 1000)
  const seconds = Math.floor((new Date().getTime() - dueDate.getTime()) / 1000)

  const suffix = seconds < 0 ? 'to go' : 'ago'

  return (
    <div className={className}>
      {formatTime(Math.abs(seconds))} {suffix}
    </div>
  )
}

export default TimeAgo
