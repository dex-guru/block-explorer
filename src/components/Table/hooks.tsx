import { createRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import clsx from 'clsx'
import { Cell } from './Cell'
import { Row } from './Row'
import { IColumn } from './types'
import styles from './Table.module.scss'

export const useBodyRows = <T,>(options: {
  columns: IColumn<T>[]
  data: T[]
  onRowClick?: (rowData: T) => void
  rowClassName?: string
  isHeader?: boolean
  getRowKey?: (rowData: T) => string
}) => {
  const { columns, data, onRowClick, rowClassName, isHeader, getRowKey } =
    options

  return data.map((dataItem, idx) => {
    const cells = columns.map((column) => {
      const className = clsx(
        styles[column.type || 'text'],
        styles[column.modifier || 'default']
      )

      const cellDisplay = column.render
        ? column.render(dataItem || ({} as T), column.placeholder)
        : dataItem
        ? `${(dataItem as Record<string, unknown>)[column.accessor]}`
        : column.placeholder || ''

      return (
        <Cell th={isHeader} key={column.accessor} className={className}>
          {cellDisplay}
        </Cell>
      )
    })

    const ref = createRef<HTMLTableRowElement>()

    return (
      <CSSTransition
        key={getRowKey ? getRowKey(dataItem) : idx}
        timeout={500}
        nodeRef={ref}
        classNames="item"
      >
        <Row
          ref={ref}
          className={clsx(styles.trow, styles.tbodyrow, rowClassName)}
          onClick={() => onRowClick && onRowClick(dataItem)}
        >
          {cells}
        </Row>
      </CSSTransition>
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
