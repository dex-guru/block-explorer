import React, { FC, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import IconInfo from '@/images/icons/info.svg'
import { getTextWithAnchors } from '@/lib/utils'

export type TooltipAnchorOptions = {
  className?: string
  place?: 'top' | 'right' | 'bottom' | 'left'
  type?: 'light' | 'dark'
}
interface TooltipAnchorProps extends TooltipAnchorOptions {
  tooltip: ReactNode
}

export const TooltipAnchor: FC<TooltipAnchorProps> = ({
  tooltip,
  className,
  place,
  type,
}) => {
  const tooltipContent =
    typeof tooltip === 'string'
      ? getTextWithAnchors(tooltip)
      : renderToStaticMarkup(<>{tooltip}</>)
  const clickable = tooltipContent.includes('<a')

  return (
    <span
      className="tooltip-anchor"
      data-tooltip-class={className}
      data-delay-hide={clickable ? 500 : undefined}
      data-tooltip-html={tooltipContent}
      data-tooltip-id="app-tooltip"
      data-tooltip-place={place}
      data-tooltip-variant={type}
    >
      <span className="icon">
        <IconInfo />
      </span>
      <span className="caption">Details</span>
    </span>
  )
}
