import { ReactNode } from 'react'

export type DetailsViewProps = {
  title: ReactNode
  address?: ReactNode
  icon?: ReactNode
  tag?: string
  children?: ReactNode | ReactNode[]
  className?: string
}
