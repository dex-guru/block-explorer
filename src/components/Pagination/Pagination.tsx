import { FC, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { getDisabled, getTotalPages } from './utils'
import Button from '@/components/Button'
import { IconArrowLeft, IconArrowRight } from '@/components/Icons'
import { useIsMount } from '@/hooks'
import { financialFormat } from '@/lib/utils'
import { PaginationVariables } from '@/types'
import styles from './Pagination.module.scss'

interface IPaginationProps {
  total: number
  defaultCurrentPage: number
  perPage?: number
  className?: string
  onChange: (variables: PaginationVariables) => void
  setDefaultCurrentPage: (page: number) => void
}

export const DEFAULT_FIRST_PAGE = 1
export const DEFAULT_PER_PAGE = 10

export const Pagination: FC<IPaginationProps> = ({
  total,
  perPage = DEFAULT_PER_PAGE,
  onChange,
  className,
  setDefaultCurrentPage,
  defaultCurrentPage = DEFAULT_FIRST_PAGE,
}) => {
  const isMounted = useIsMount()

  const [currentPage, setCurrentPage] = useState(defaultCurrentPage)
  const [totalPages, setTotalPages] = useState(() =>
    getTotalPages(total, perPage)
  )

  const doChangePage = useCallback(
    (page: number) => {
      const toPage = Math.min(totalPages, Math.max(1, page))

      const skip = (toPage - 1) * perPage

      onChange({ first: perPage, skip })
      setDefaultCurrentPage(toPage)
    },
    [totalPages, onChange, perPage, setDefaultCurrentPage]
  )

  const getNextHandler = useCallback(() => {
    doChangePage(currentPage + 1)
  }, [currentPage, doChangePage])

  const getPrevHandler = useCallback(() => {
    doChangePage(currentPage - 1)
  }, [currentPage, doChangePage])

  const getFirstHandler = useCallback(() => {
    doChangePage(1)
  }, [doChangePage])

  const getLastHandler = useCallback(() => {
    doChangePage(totalPages)
  }, [doChangePage, totalPages])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    setTotalPages(getTotalPages(total, perPage))
  }, [isMounted, perPage, currentPage, total])

  useEffect(() => {
    if (!isMounted) {
      return
    }

    setCurrentPage(defaultCurrentPage)
  }, [isMounted, defaultCurrentPage, total])

  if (!totalPages) {
    return <div className={clsx(styles.container, className)} />
  }

  const disabled = getDisabled(totalPages, currentPage)

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        caption="First"
        onClick={getFirstHandler}
        disabled={disabled.prev}
        className={styles.button}
      />
      <Button
        onClick={getPrevHandler}
        disabled={disabled.prev}
        className={styles.button}
        icon={<IconArrowLeft />}
      />

      <span className={styles.counter}>
        Page {financialFormat(currentPage)} of {financialFormat(totalPages)}
      </span>

      <Button
        icon={<IconArrowRight />}
        onClick={getNextHandler}
        disabled={disabled.next}
        className={styles.button}
      />
      <Button
        caption="Last"
        onClick={getLastHandler}
        disabled={disabled.next}
        className={styles.button}
      />
    </div>
  )
}
