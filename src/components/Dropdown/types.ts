import { ReactNode } from 'react'

export type DropdownProps = {
  caption?: ReactNode
  icon?: ReactNode
  className?: string
  contentClassName?: string
  position?: 'absolute' | 'fixed'
  isOpen?: boolean
  content?: ReactNode | ReactNode[]
  children?: ReactNode | ReactNode[]
  onOpen?: () => void
  onClose?: () => void
}
