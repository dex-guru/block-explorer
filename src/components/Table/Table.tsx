import { useBodyRows, useHeader } from './hooks'
import { IColumn } from './types'
import styles from './Table.module.scss'

interface ITableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  bodyRowClassName?: string
}

export function Table<T>({ columns, data }: ITableProps<T>) {
  const header = useHeader<T>(columns)

  const rows = useBodyRows<T>(columns, data, styles.row)

  return (
    <table className={styles.table}>
      <thead className={styles.header}>{header}</thead>
      <tbody>{rows}</tbody>
    </table>
  )
}
