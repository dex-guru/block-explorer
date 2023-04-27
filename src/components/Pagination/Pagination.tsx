import { FC, useCallback, useState } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import { getTotalPages } from './utils'
import ArrowLeft from '@/images/icons/arrow-left.svg'
import ArrowRight from '@/images/icons/arrow-right.svg'
import { PaginationVariables } from '@/types'
import styles from './Pagination.module.scss'

interface IPaginationProps {
  total: number
  perPage?: number
  className?: string
  onChange: (variables: PaginationVariables) => void
}

export const DEFAULT_FIRST_PAGE = 1
export const DEFAULT_PER_PAGE = 10

export const Pagination: FC<IPaginationProps> = ({
  total,
  perPage = DEFAULT_PER_PAGE,
  onChange,
  className,
}) => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_FIRST_PAGE)
  const [totalPages] = useState(() => getTotalPages(total, perPage))
  const [disabled, setDisabled] = useState(() => {
    if (total > perPage) {
      return { prev: true, first: true, last: false, next: false }
    }

    return { prev: true, first: true, last: true, next: true }
  })

  const getNextHandler = useCallback(() => {
    const skip = currentPage * perPage

    if (skip + perPage >= total) {
      setDisabled({ ...disabled, last: true, next: true })
      setCurrentPage(total)
      onChange({ first: perPage, skip: total - perPage })
      return
    }

    setCurrentPage(currentPage + 1)
    setDisabled({ ...disabled, first: false, prev: false })
    onChange({ first: perPage, skip })
  }, [currentPage, disabled, onChange, perPage, total])

  const getPrevHandler = useCallback(() => {
    const skip = currentPage * perPage - perPage

    if (skip - perPage <= 0) {
      setDisabled({ ...disabled, prev: true, first: true })
      setCurrentPage(DEFAULT_FIRST_PAGE)
      onChange({ first: perPage, skip: 0 })
      return
    }

    setCurrentPage(currentPage - 1)
    setDisabled({ ...disabled, last: false, next: false })
    onChange({ first: perPage, skip })
  }, [currentPage, disabled, onChange, perPage])

  const getFirstHandler = useCallback(() => {
    setDisabled({ ...disabled, prev: true, first: true })
    setCurrentPage(DEFAULT_FIRST_PAGE)
    onChange({ first: perPage, skip: 0 })
  }, [disabled, onChange, perPage])

  const getLastHandler = useCallback(() => {
    const skip = total - perPage
    setDisabled({ ...disabled, last: true, next: true })
    setCurrentPage(totalPages)
    onChange({ first: perPage, skip })
  }, [disabled, onChange, perPage, total, totalPages])

  return (
    <div className={clsx(styles.container, className)}>
      <Button
        onClick={getPrevHandler}
        disabled={disabled.prev}
        className={styles['pagination-button']}
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={getFirstHandler}
        disabled={disabled.first}
        className={styles['pagination-button']}
      >
        First
      </Button>
      <span className={styles.counter}>
        {currentPage} of {totalPages}
      </span>
      <Button
        onClick={getLastHandler}
        disabled={disabled.last}
        className={styles['pagination-button']}
      >
        Last
      </Button>
      <Button
        onClick={getNextHandler}
        disabled={disabled.next}
        className={styles['pagination-button']}
      >
        <ArrowRight />
      </Button>
    </div>
  )
}
