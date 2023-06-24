import { useCallback, useState } from 'react'
import clsx from 'clsx'
import Empty from '../Empty'
import { DEFAULT_FIRST_PAGE, DEFAULT_PER_PAGE, Pagination } from '../Pagination'
import { PerPageSelector } from '../PerPageSelector'
import { Table } from '../Table'
import { DataTableProps } from './types'
import IconEmpty from '@/images/icons/no-flash.svg'
import { financialFormat } from '@/lib/utils'
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
    return (
      <PerPageSelector
        onChange={onChangePerPageHandler}
        defaultPerPage={currentPerPagePage}
      />
    )
  }, [currentPerPagePage, onChangePerPageHandler])

  const renderPagination = useCallback(() => {
    return (
      <Pagination
        total={total}
        perPage={currentPerPagePage}
        onChange={onPageChange}
        className={styles.pagination}
        defaultCurrentPage={currentPage}
        setDefaultCurrentPage={setCurrentPage}
      />
    )
  }, [currentPage, currentPerPagePage, onPageChange, total])

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {renderPerPage()}
        <span className={styles.totalRows}>
          Total {financialFormat(total, { roundBigNumbersFrom: 'T' })} rows
        </span>
        {renderPagination()}
      </div>
      <div className={styles.body}>
        {!tablePropsRest.isLoading && !total && props.empty && (
          <Empty icon={<IconEmpty />} {...props.empty} />
        )}

        {!!total && <Table {...tablePropsRest} className={styles.table} />}
      </div>
      <div className={styles.footer}>
        {renderPerPage()}
        {renderPagination()}
      </div>
    </div>
  )
}

export default DataTable
