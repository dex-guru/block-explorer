import React, { FC, ReactNode } from 'react'
import clsx from 'clsx'
import { TooltipAnchor, TooltipAnchorOptions } from './TooltipAnchor'

export type HeadingSize = 'lg' | 'md' | 'sm' | 'xs'

const elements: Record<HeadingSize, string> = {
  lg: 'h1',
  md: 'h2',
  sm: 'h3',
  xs: 'span',
}

export const Heading: FC<
  React.HTMLAttributes<HTMLDivElement> & {
    size?: HeadingSize
    caption?: ReactNode
    className?: string
    tooltip?: ReactNode
    tooltipOptions?: TooltipAnchorOptions
  }
> = ({
  size = 'md',
  caption,
  className,
  tooltip,
  tooltipOptions,
  children,
  ...rest
}) => {
  return React.createElement(
    elements[size],
    {
      className: clsx('heading', { [`heading--${size}`]: size }, className),
      ...rest,
    },
    <>
      <span className="caption">{children || caption}</span>{' '}
      {tooltip && <TooltipAnchor tooltip={tooltip} {...tooltipOptions} />}
    </>
  )
}
