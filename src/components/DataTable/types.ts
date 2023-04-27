import { ReactNode } from 'react'
import { ITableProps } from '../Table'
import { PaginationVariables } from '@/types'

export type DataTableProps<T> = ITableProps<T> & {
  className?: string
  children?: ReactNode

  total?: number
  perPage?: number
  onPageChange?: (variables: PaginationVariables) => void
}
