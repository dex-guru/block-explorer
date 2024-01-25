import { FC, useEffect, useState } from 'react'

import clsx from 'clsx'
import { useIntervalWhen } from 'rooks'

import { DateTimeProps } from './types'

import styles from './DateTime.module.scss'

const DateTime: FC<DateTimeProps> = ({
  timestamp,
  showDate = true,
  showTime = true,
  className,
}) => {
  const [date, setDate] = useState<Date>()

  useEffect(() => {
    if (!timestamp) {
      return
    }

    setDate(new Date(timestamp * 1000))
  }, [timestamp])

  useIntervalWhen(
    () => {
      setDate(new Date())
    },
    1000,
    typeof timestamp === 'undefined',
    true
  )

  if (!date || (!showDate && !showTime)) {
    return null
  }

  let method: 'toLocaleString' | 'toLocaleTimeString' | 'toLocaleDateString' = 'toLocaleString'

  if (!showDate) {
    method = 'toLocaleTimeString'
  }
  if (!showTime) {
    method = 'toLocaleDateString'
  }

  return (
    <span className={clsx(styles.container, className)}>
      {date[method]('en-GB', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        hour12: false,
      }).replace(' at ', ', ')}{' '}
      UTC
    </span>
  )
}

export default DateTime
