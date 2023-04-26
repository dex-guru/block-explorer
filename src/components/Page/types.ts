import { ReactNode } from 'react'

export type PageHeaderProps = { withMenu?: boolean; withSearch?: boolean }
export type PageProps = PageHeaderProps & {
  children?: ReactNode
}
