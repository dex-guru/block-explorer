import { ReactNode } from 'react'

export interface IColumn<T> {
  render?: (data: T) => ReactNode
  accessor: string
  title?: string
  type?: 'number' | 'text'
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
