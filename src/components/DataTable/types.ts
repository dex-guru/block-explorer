import { ReactNode } from 'react'
import { EmptyProps } from '../Empty'
import { ITableProps } from '../Table'
import { PaginationVariables } from '@/types'

export type DataTableProps<T> = ITableProps<T> & {
  className?: string
  children?: ReactNode | ReactNode[]
  empty?: EmptyProps

  onPageChange: (variables: PaginationVariables) => void
  total?: number
  perPage?: number
}
