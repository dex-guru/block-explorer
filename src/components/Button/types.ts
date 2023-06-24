import { ReactNode } from 'react'
import { UrlObject } from 'url'

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
  className?: string
  active?: boolean
  disabled?: boolean
  hidden?: boolean
  pending?: boolean
  to?: string | UrlObject | null
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}
