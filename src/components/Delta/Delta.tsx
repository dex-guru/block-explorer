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

const Delta: FC<DeltaProps> = ({ value = 0, className, showZero = false }) => {
  if (!value && !showZero) {
    return null
  }

  const absValue = Math.abs(value)

  const displayValue = normalizeDelta(absValue)

  return (
    <span
      className={clsx(styles.container, className, {
        [styles.up]: value > 0,
        [styles.down]: value < 0,
        [styles.low]: absValue && displayValue === '0',
      })}
      data-tooltip-id="app-tooltip"
      data-tooltip-content={String(absValue)}
    >
      <span className="delta__value">{displayValue}%</span>
    </span>
  )
}

export default Delta
