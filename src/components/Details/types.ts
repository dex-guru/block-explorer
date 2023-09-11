import { ReactNode } from 'react'

export type DetailsProps = {
  title: ReactNode
  isOpen?: boolean
  className?: string
  children?: ReactNode | ReactNode[]
  onToggle?: () => void
}
