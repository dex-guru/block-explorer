import { ReactNode } from 'react'
import { TooltipAnchorOptions } from '../TooltipAnchor'

export type HeadingSize = 'lg' | 'md' | 'sm' | 'xs'

export type HeadingProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: HeadingSize
  caption?: ReactNode
  className?: string
  tooltip?: ReactNode
  tooltipOptions?: TooltipAnchorOptions
}
