import clsx from 'clsx'
import { useBodyRows, useHeader } from './hooks'
import { IColumn } from './types'
import styles from './Table.module.scss'

export interface ITableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  className?: string
}

export function Table<T>({ columns, data, className }: ITableProps<T>) {
  const header = useHeader<T>(columns)

  const rows = useBodyRows<T>(columns, data)

  return (
    <div className={clsx(styles.container, className)}>
      <table className={styles.table}>
        <thead className={styles.thead}>{header}</thead>
        <tbody className={styles.tbody}>{rows}</tbody>
      </table>
    </div>
  )
}

export default Table
