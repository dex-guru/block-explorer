import { getPrefixClassName } from '@/lib/utils'
import classNames from 'classnames'
import Link from 'next/link'
import React, { FC, ReactNode } from 'react'

export type ButtonSize = 'xl' | 'lg' | 'md' | 'sm' | 'xs'

export enum ButtonSizes {
  xl = 'xl',
  lg = 'lg',
  md = 'md',
  sm = 'sm',
  xs = 'xs',
}

export interface ButtonProps {
  caption?: string
  indicator?: string
  icon?: ReactNode
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

const Button: FC<React.HTMLProps<HTMLElement> & ButtonProps> = ({
  caption,
  indicator,
  icon,
  buttonSize = 'md',
  className,
  classNamePrefix = 'button',
  active,
  disabled,
  hidden,
  to,
  href,
  onClick,
  children,
  ...rest
}) => {
  const classProp = classNames(
    getPrefixClassName(classNamePrefix, '', buttonSize || ''),
    {
      active: !!active,
      disabled: (!to || !href) && disabled,
      hidden: !!hidden,
    },
    className
  )

  const destination = to || href

  const isExternalLink = destination?.startsWith('http')

  const content = (
    <>
      {!!icon && (
        <span className={getPrefixClassName(classNamePrefix, 'icon')}>
          <span className="icon">{icon}</span>
        </span>
      )}
      {(caption || children) && (
        <span className={getPrefixClassName(classNamePrefix, 'caption')}>
          <div className="caption">{caption || children}</div>
        </span>
      )}
      {indicator && (
        <span className={getPrefixClassName(classNamePrefix, 'indicator')}>
          {indicator}
        </span>
      )}
    </>
  )

  const props = {
    className: classProp,
    disabled: disabled,
    onClick,

    ...rest,
  }

  if (destination) {
    const toCorrectProp = isExternalLink
      ? { pathname: destination }
      : destination

    return (
      <Link
        {...props}
        href={toCorrectProp}
        ref={undefined}
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'noopener noreferrer' : undefined}
      >
        {content}
      </Link>
    )
  }

  return React.createElement('button', props, content)
}

export default Button
