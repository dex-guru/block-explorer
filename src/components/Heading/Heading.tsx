import React, { FC, ReactNode } from 'react'
import clsx from 'clsx'
import TooltipAnchor from '../TooltipAnchor'
import { HeadingProps, HeadingSize } from './type'
import styles from './Heading.module.scss'

const elements: Record<HeadingSize, string> = {
  lg: 'h1',
  md: 'h2',
  sm: 'h3',
  xs: 'span',
}

export const Heading: FC<HeadingProps> = ({
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
      className: clsx(styles.container, styles[size], className),
      ...rest,
    },
    <>
      <span className="caption">{children || caption}</span>{' '}
      {tooltip && <TooltipAnchor tooltip={tooltip} {...tooltipOptions} />}
    </>
  )
}
