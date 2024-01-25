import { ReactNode } from 'react'

import { PaginationVariables } from '@/types'

import { StateViewProps } from '../StateView'
import { ITableProps } from '../Table'

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
