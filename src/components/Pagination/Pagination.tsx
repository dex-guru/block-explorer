import { FC, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import { getDisabled } from './utils'
import { useIsMount } from '@/hooks'
import ArrowLeft from '@/images/icons/arrow-left.svg'
import ArrowRight from '@/images/icons/arrow-right.svg'
import { financialFormat } from '@/lib/utils'
import styles from './Pagination.module.scss'

interface IPaginationProps {
  total: number
  page: number
  className?: string
  onChange: (page: number) => void
}

export const DEFAULT_FIRST_PAGE = 1
export const DEFAULT_PER_PAGE = 10

export const Pagination: FC<IPaginationProps> = ({
  total,
  onChange,
  className,
  page = DEFAULT_FIRST_PAGE,
}) => {
  const isMounted = useIsMount()
  const [disabled, setDisabled] = useState(() => getDisabled(page, total))

  const doPageChange = useCallback(
    (value: number) => {
      const pageValue = Math.max(1, Math.min(value, total))

      setDisabled(getDisabled(total, pageValue))

      onChange(pageValue)
    },
    [onChange, total]
  )

  useEffect(() => {
    if (isMounted) {
      setDisabled(getDisabled(total, page))
    }
  }, [isMounted, total, page])

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        caption="First"
        onClick={() => {
          doPageChange(1)
        }}
        disabled={disabled.prev}
        className={styles.button}
      />
      <Button
        onClick={() => {
          doPageChange(page - 1)
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
          doPageChange(page + 1)
        }}
        disabled={disabled.next}
        className={styles.button}
      />
      <Button
        caption="Last"
        onClick={() => {
          doPageChange(total)
        }}
        disabled={disabled.next}
        className={styles.button}
      />
    </div>
  )
}

export default Pagination
