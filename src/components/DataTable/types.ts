import { ReactNode } from 'react'
import { StateViewProps } from '../StateView'
import { ITableProps } from '../Table'
import { PaginationVariables } from '@/types'

export type DataTableProps<T> = ITableProps<T> & {
  className?: string
  children?: ReactNode | ReactNode[]
  empty?: StateViewProps
  header?: ReactNode
  total?: number
  fullTotal?: number
  perPage?: number
  getFullTotal?: () => void
  onPageChange: (variables: PaginationVariables) => void
}
