import { useCallback, useState } from 'react'
import clsx from 'clsx'
import { DEFAULT_FIRST_PAGE, DEFAULT_PER_PAGE, Pagination } from '../Pagination'
import { PerPageSelector } from '../PerPageSelector'
import { Table } from '../Table'
import { DataTableProps } from './types'
import styles from './DataTable.module.scss'

export function DataTable<T>(props: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(DEFAULT_FIRST_PAGE)
  const [currentPerPagePage, setCurrentPerPage] = useState(DEFAULT_PER_PAGE)

  const { className, total = 0, onPageChange, ...tablePropsRest } = props

  const onChangePerPageHandler = useCallback(
    (value: number) => {
      onPageChange && onPageChange({ first: value, skip: 0 })
      setCurrentPerPage(value)
      setCurrentPage(DEFAULT_FIRST_PAGE)
    },
    [onPageChange]
  )

  const renderPerPage = useCallback(() => {
    if (!total) {
      return null
    }

    return (
      <PerPageSelector
        onChange={onChangePerPageHandler}
        defaultPerPage={currentPerPagePage}
      />
    )
  }, [currentPerPagePage, onChangePerPageHandler, total])

  const renderPagination = useCallback(() => {
    if (!total || !onPageChange) {
      return null
    }

    return (
      <Pagination
        total={total}
        perPage={currentPerPagePage}
        onChange={onPageChange}
        className={styles.pagination}
        defaultCurrentPage={currentPage}
        setdefaultCurrentPage={setCurrentPage}
      />
    )
  }, [currentPage, currentPerPagePage, onPageChange, total])

  if (!props.data?.length) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      {total > currentPerPagePage && (
        <div className={styles.header}>
          {renderPerPage()}
          {renderPagination()}
        </div>
      )}
      <div className={styles.body}>
        <Table {...tablePropsRest} className={styles.table} />
      </div>
      {total > currentPerPagePage && (
        <div className={styles.footer}>
          {renderPerPage()}
          {renderPagination()}
        </div>
      )}
    </div>
  )
}

export default DataTable
