import { ReactNode } from 'react'

export interface IColumn<T> {
  render?: (data: T) => ReactNode
  accessor: string
  header: string
  width?: number
  emptyPlaceholder?: string
  cellClassname?: string
  headerCellClassname?: string
}

export interface ICell {
  render?: ReactNode
  accessor: string
}

export interface ITableSort {
  name: string
  direction: string
}

export interface ITableFilter {
  name: string
  value: string
}
