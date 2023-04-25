import { ReactNode } from 'react'

export type TooltipAnchorOptions = {
  className?: string
  place?: 'top' | 'right' | 'bottom' | 'left'
  type?: 'light' | 'dark'
}

export type TooltipAnchorProps = TooltipAnchorOptions & {
  tooltip: ReactNode
}
