import clsx from 'clsx'
import { Pagination } from '../Pagination'
import { Table } from '../Table'
import { DataTableProps } from './types'
import styles from './DataTable.module.scss'

export function DataTable<T>(props: DataTableProps<T>) {
  if (!props.data?.length) {
    return null
  }

  const { className, total, perPage, onPageChange } = props

  const renderPagination = () => {
    if (!total || !onPageChange) {
      return null
    }
    return (
      <Pagination
        total={total}
        perPage={perPage}
        onChange={onPageChange}
        className={styles.pagination}
      />
    )
  }

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>{renderPagination()}</div>
      <div className={styles.body}>
        <Table {...props} className={styles.table} />
      </div>
      <div className={styles.footer}>{renderPagination()}</div>
    </div>
  )
}

export default DataTable
