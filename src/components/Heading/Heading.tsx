import React, { FC } from 'react'
import clsx from 'clsx'
import TooltipAnchor from '../TooltipAnchor'
import { HeadingProps, HeadingSize } from './type'
import styles from './Heading.module.scss'

const elements: Record<HeadingSize, string> = {
  lg: 'h1',
  md: 'h2',
  sm: 'h3',
  xs: 'strong',
}

export const Heading: FC<HeadingProps> = ({
  size = 'md',
  caption,
  className,
  tooltip,
  tooltipOptions,
  children,
  indicator,
  ...rest
}) => {
  return React.createElement(
    elements[size],
    {
      className: clsx(styles.container, styles[size], className),
      ...rest,
    },
    <>
      <span className={styles.caption}>{children || caption}</span> {indicator}
      {tooltip && <TooltipAnchor tooltip={tooltip} {...tooltipOptions} />}
    </>
  )
}
