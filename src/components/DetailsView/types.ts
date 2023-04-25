import { ReactNode } from 'react'

export type DetailsViewProps = {
  title: string
  address?: string
  icon?: ReactNode
  tag?: string
  children: ReactNode
  className?: string
}
