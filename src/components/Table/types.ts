import { ReactNode } from 'react'

export interface IColumn<T> {
  render?: (data: T, placeholder?: ReactNode) => ReactNode
  accessor: string
  title?: ReactNode
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
