import { FC } from 'react'
import { useBodyRows, useHeader } from './hooks'
import { IColumn } from './types'
import styles from './Table.module.scss'

interface ITableProps {
  columns: IColumn<object>[]
  data: object[]
  bodyRowClassName?: string
}

export const Table: FC<ITableProps> = ({ columns, data }) => {
  const header = useHeader(columns)

  const rows = useBodyRows(columns, data, styles.row)

  return (
    <table className={styles.table}>
      <thead className={styles.header}>{header}</thead>
      <tbody>{rows}</tbody>
    </table>
  )
}
