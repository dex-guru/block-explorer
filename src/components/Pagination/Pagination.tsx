import { FC, useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import { getDisabled, getTotalPages } from './utils'
import { useIsMount } from '@/hooks'
import ArrowLeft from '@/images/icons/arrow-left.svg'
import ArrowRight from '@/images/icons/arrow-right.svg'
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
  const [disabled, setDisabled] = useState(() => getDisabled(total, perPage))

  const getNextHandler = useCallback(() => {
    const skip = currentPage * perPage

    if (skip + perPage >= total) {
      setDisabled({ ...disabled, last: true, next: true })
      setDefaultCurrentPage(total)
      onChange({ first: perPage, skip: total - perPage })
      return
    }

    setDefaultCurrentPage(currentPage + 1)
    setDisabled({ ...disabled, first: false, prev: false })
    onChange({ first: perPage, skip })
  }, [currentPage, disabled, onChange, perPage, setDefaultCurrentPage, total])

  const getPrevHandler = useCallback(() => {
    const skip = currentPage * perPage - perPage

    if (skip - perPage <= 0) {
      setDisabled({ ...disabled, prev: true, first: true })
      setDefaultCurrentPage(DEFAULT_FIRST_PAGE)
      onChange({ first: perPage, skip: 0 })
      return
    }

    setDefaultCurrentPage(currentPage - 1)
    setDisabled({ ...disabled, last: false, next: false })
    onChange({ first: perPage, skip })
  }, [currentPage, disabled, onChange, perPage, setDefaultCurrentPage])

  const getFirstHandler = useCallback(() => {
    const disabledState = getDisabled(total, perPage)
    setDisabled({ ...disabledState, prev: true, first: true })
    setDefaultCurrentPage(DEFAULT_FIRST_PAGE)
    onChange({ first: perPage, skip: 0 })
  }, [onChange, perPage, setDefaultCurrentPage, total])

  const getLastHandler = useCallback(() => {
    const skip = total - perPage
    const disabledState = getDisabled(total, perPage)
    setDisabled({ ...disabledState, last: true, next: true })
    setDefaultCurrentPage(totalPages)
    onChange({ first: perPage, skip })
  }, [onChange, perPage, setDefaultCurrentPage, total, totalPages])

  useEffect(() => {
    if (isMounted) {
      setTotalPages(getTotalPages(total, perPage))
      setDisabled(getDisabled(total, perPage))
    }
  }, [isMounted, perPage, total])

  useEffect(() => {
    if (isMounted) {
      setCurrentPage(defaultCurrentPage)
    }
  }, [isMounted, defaultCurrentPage])

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        onClick={getPrevHandler}
        disabled={disabled.prev}
        className={styles.button}
        icon={<ArrowLeft />}
      />
      <Button
        caption="First"
        onClick={getFirstHandler}
        disabled={disabled.first}
        className={styles.button}
      />

      <span className={styles.counter}>
        Page {financialFormat(currentPage)} of {financialFormat(totalPages)}
      </span>

      <Button
        caption="Last"
        onClick={getLastHandler}
        disabled={disabled.last}
        className={styles.button}
      />
      <Button
        icon={<ArrowRight />}
        onClick={getNextHandler}
        disabled={disabled.next}
        className={styles.button}
      />
    </div>
  )
}
