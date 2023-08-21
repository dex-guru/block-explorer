import { ReactNode } from 'react'

export type TooltipContentEntry = {
  title: ReactNode
  value: ReactNode
  color?: string
}

export type TooltipContentProps = {
  title?: ReactNode
  entries?: TooltipContentEntry[]
  children?: ReactNode
}
