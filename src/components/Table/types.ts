import { ReactNode } from 'react'

export interface IColumn<T> {
  render?: (data: T, placeholder?: ReactNode, idx?: number) => ReactNode
  accessor: string
  title?: ReactNode
  tooltip?: string
  type?: 'number' | 'text' | 'center'
  modifier?: string
  placeholder?: ReactNode
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
