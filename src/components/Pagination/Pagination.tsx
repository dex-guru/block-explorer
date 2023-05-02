import { FC } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import { getDisabled } from './utils'
import ArrowLeft from '@/images/icons/arrow-left.svg'
import ArrowRight from '@/images/icons/arrow-right.svg'
import { financialFormat } from '@/lib/utils'
import styles from './Pagination.module.scss'

interface IPaginationProps {
  total: number
  page: number
  onChange: (page: number) => void
  className?: string
}

export const DEFAULT_FIRST_PAGE = 1
export const DEFAULT_PER_PAGE = 10

export const Pagination: FC<IPaginationProps> = ({
  total,
  onChange,
  className,
  page = DEFAULT_FIRST_PAGE,
}) => {
  const disabled = getDisabled(total, page)

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        caption="First"
        onClick={() => {
          onChange(1)
        }}
        disabled={disabled.prev}
        className={styles.button}
      />
      <Button
        onClick={() => {
          onChange(page - 1)
        }}
        disabled={disabled.prev}
        className={styles.button}
        icon={<ArrowLeft />}
      />

      <span className={styles.counter}>
        Page {financialFormat(page)} of {financialFormat(total)}
      </span>

      <Button
        icon={<ArrowRight />}
        onClick={() => {
          onChange(page + 1)
        }}
        disabled={disabled.next}
        className={styles.button}
      />
      <Button
        caption="Last"
        onClick={() => {
          onChange(total)
        }}
        disabled={disabled.next}
        className={styles.button}
      />
    </div>
  )
}

export default Pagination
