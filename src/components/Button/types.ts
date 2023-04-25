import { ReactNode } from 'react'

export type ButtonSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

export enum ButtonSizes {
  xl = 'xl',
  lg = 'lg',
  md = 'md',
  sm = 'sm',
  xs = 'xs',
}

export interface ButtonProps {
  caption?: ReactNode
  icon?: ReactNode
  indicator?: ReactNode
  buttonSize?: ButtonSize
  className?: string
  classNamePrefix?: string
  active?: boolean
  disabled?: boolean
  hidden?: boolean
  pending?: boolean
  to?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}
