import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

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
  }
> = ({ size = 'md', caption, className, children, ...rest }) => {
  return React.createElement(
    elements[size],
    {
      className: classNames(
        'heading',
        { [`heading--${size}`]: size },
        className
      ),
      ...rest,
    },
    <>
      <span className="caption">{children || caption}</span>
    </>
  )
}
