import { ReactNode } from 'react'

export type DetailsViewProps = {
  title: ReactNode
  address?: string
  icon?: ReactNode
  tag?: string
  children?: ReactNode
  className?: string
}
