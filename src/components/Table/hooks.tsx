import { v1 as uuidv1 } from 'uuid'
import { Cell } from './Cell'
import { Row } from './Row'
import { IColumn } from './types'

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
      if (!cellData) {
        if (column.emptyPlaceholder) {
          return column.emptyPlaceholder
        }
        return ''
      }

      if (cellData && column.render) {
        return (
          <Cell
            th={isHeader}
            key={column.accessor}
            className={column.cellClassname}
          >
            {column.render(dataItem)}
          </Cell>
        )
      }

      return (
        <Cell
          th={isHeader}
          key={column.accessor}
          className={column.cellClassname}
        >
          {`${cellData}`}
        </Cell>
      )
    })

    return (
      <Row
        key={uuidv1()}
        className={rowClassName}
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
    return (
      <Cell
        th={true}
        key={column.accessor}
        className={column.headerCellClassname}
      >
        {column.header}
      </Cell>
    )
  })

  return <Row className={rowClassName}>{cells}</Row>
}
