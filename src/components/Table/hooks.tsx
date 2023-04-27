import clsx from 'clsx'
import { v1 as uuidv1 } from 'uuid'
import { Cell } from './Cell'
import { Row } from './Row'
import { IColumn } from './types'
import styles from './Table.module.scss'

export const useBodyRows = <T,>(
  columns: IColumn<T>[],
  data: T[],
  rowClassName?: string,
  isHeader?: boolean,
  onRowClick?: (rowData: T) => void
) => {
  return data.map((dataItem) => {
    const cells = columns.map((column) => {
      const cellData = (dataItem as Record<string, unknown>)[column.accessor]

      const className = clsx(
        styles[column.type || 'text'],
        styles[column.modifier || 'default']
      )

      const cellDisplay = column.render
        ? column.render(dataItem, column.placeholder)
        : cellData
        ? `${cellData}`
        : column.placeholder || ''

      return (
        <Cell th={isHeader} key={column.accessor} className={className}>
          {cellDisplay}
        </Cell>
      )
      if (column.render) {
      }
    })

    return (
      <Row
        key={uuidv1()}
        className={clsx(styles.trow, styles.tbodyrow, rowClassName)}
        onClick={() => onRowClick && onRowClick(dataItem)}
      >
        {cells}
      </Row>
    )
  })
}

export const useHeader = <T,>(
  columns: IColumn<T>[],
  // isFiltered?:boolean,
  // onSort?: () => void,
  // onFilter?:()=>void,,
  rowClassName?: string
) => {
  const cells = columns.map((column) => {
    const className = clsx(
      styles[column.type || 'text'],
      styles[column.modifier || 'default']
    )

    return (
      <Cell th={true} key={column.accessor} className={className}>
        {column.title}
      </Cell>
    )
  })

  return (
    <Row className={clsx(styles.trow, styles.theadrow, rowClassName)}>
      {cells}
    </Row>
  )
}
