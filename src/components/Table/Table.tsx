import clsx from 'clsx'
import { useBodyRows, useHeader } from './hooks'
import { IColumn } from './types'
import styles from './Table.module.scss'

export interface ITableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  className?: string
  showHeader?: boolean
  isLoading?: boolean
  rowClassName?: string
  onRowClick?: (rowData: T) => void
}

export function Table<T>({
  columns,
  data,
  showHeader = true,
  className,
  isLoading,
  rowClassName,
  onRowClick,
}: ITableProps<T>) {
  const header = useHeader<T>(columns)

  const rows = useBodyRows<T>({ columns, data, rowClassName, onRowClick })

  return (
    <div className={clsx(styles.container, className)}>
      <table
        className={clsx(styles.table, { [styles.tableLoading]: isLoading })}
      >
        {showHeader && (
          <thead
            className={clsx(styles.thead, { [styles.theadLoading]: isLoading })}
          >
            {header}
          </thead>
        )}
        <tbody
          className={clsx(styles.tbody, { [styles.tbodyLoading]: isLoading })}
        >
          {rows}
        </tbody>
      </table>
    </div>
  )
}

export default Table
