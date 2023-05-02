import { useCallback, useState } from 'react'
import clsx from 'clsx'
import Empty from '../Empty'
import { DEFAULT_FIRST_PAGE, DEFAULT_PER_PAGE, Pagination } from '../Pagination'
import { getTotalPages } from '../Pagination/utils'
import { PerPageSelector } from '../PerPageSelector'
import { Table } from '../Table'
import { DataTableProps } from './types'
import IconEmpty from '@/images/icons/no-flash.svg'
import styles from './DataTable.module.scss'

export function DataTable<T>(props: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(DEFAULT_FIRST_PAGE)
  const [currentPerPage, setCurrentPerPage] = useState(DEFAULT_PER_PAGE)

  const { className, total = 0, onPageChange, ...tablePropsRest } = props

  const onChangePerPageHandler = useCallback(
    (value: number) => {
      onPageChange && onPageChange({ first: value, skip: 0 })
      setCurrentPerPage(value)
      setCurrentPage(DEFAULT_FIRST_PAGE)
    },
    [onPageChange]
  )

  const totalPages = getTotalPages(total, currentPerPage)

  const handlePageChange = useCallback(
    (value: number) => {
      const pageValue = Math.max(1, Math.min(value, total))
      setCurrentPage(pageValue)

      if (!onPageChange) {
        return
      }

      onPageChange({
        first: currentPerPage,
        skip: currentPerPage * (pageValue - 1),
      })
    },
    [onPageChange, currentPerPage, total]
  )

  const selector = total ? (
    <PerPageSelector
      onChange={onChangePerPageHandler}
      defaultPerPage={currentPerPage}
    />
  ) : null

  const pagination =
    total && onPageChange ? (
      <Pagination
        page={currentPage}
        total={totalPages}
        onChange={handlePageChange}
        className={styles.pagination}
      />
    ) : null

  const isShowPagination = total > currentPerPage

  return (
    <div className={clsx(styles.container, className)}>
      {isShowPagination && (
        <div className={styles.header}>
          {selector}
          {pagination}
        </div>
      )}
      <div className={styles.body}>
        {!total && props.empty && (
          <Empty icon={<IconEmpty />} {...props.empty} />
        )}

        {!!total && <Table {...tablePropsRest} className={styles.table} />}
      </div>
      {isShowPagination && (
        <div className={styles.footer}>
          {selector}
          {pagination}
        </div>
      )}
    </div>
  )
}

export default DataTable
