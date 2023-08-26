import { ReactNode } from 'react'

export type DropdownButtonProps = {
  caption?: ReactNode
  icon?: ReactNode
  className?: string
}

export type DropdownContentProps = {
  toggle: HTMLElement | null
  contentClassName?: string
  isOpen?: boolean
  content?: ReactNode | ReactNode[]
  children?: ReactNode | ReactNode[]
  onOpen?: () => void
  onClose?: () => void
  isRight?: boolean
}

export type DropdownProps = DropdownButtonProps &
  Omit<DropdownContentProps, 'toggle'>
