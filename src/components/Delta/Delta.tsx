import { FC } from 'react'
import clsx from 'clsx'
import { DeltaProps } from './types'
import { financialFormat } from '@/lib/utils'
import styles from './Delta.module.scss'

export const normalizeDelta = (value: number): string => {
  return value < 100
    ? financialFormat(value, { decimals: 2 })
    : financialFormat(value, { roundBigNumbersFrom: 'K' })
}

const Delta: FC<DeltaProps> = ({ value = 0, className, showZero = true }) => {
  if (!value && !showZero) {
    return null
  }

  const absValue = Math.abs(value)
  const displayValue = normalizeDelta(absValue) as string
  const isLow = absValue && displayValue === '0'

  return (
    <span
      className={clsx(styles.container, className, {
        [styles.up]: value > 0,
        [styles.down]: value < 0,
        [styles.low]: isLow,
        [styles.neutral]: !absValue,
      })}
      data-tooltip-id={isLow ? 'app-tooltip' : undefined}
      data-tooltip-content={isLow ? `${absValue}%` : undefined}>
      {!isLow && value > 0 && '+'}
      {!isLow && value < 0 && '–'}
      {!!isLow && '~'}
      {displayValue}%
    </span>
  )
}

export default Delta
