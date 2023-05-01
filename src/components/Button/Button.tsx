import React, { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ButtonProps } from './types'
import styles from './Button.module.scss'

const Button: FC<React.HTMLProps<HTMLElement> & ButtonProps> = ({
  caption,
  icon,
  indicator,
  className,
  active,
  disabled,
  hidden,
  to,
  href,
  onClick,
  children,
  ...rest
}) => {
  const classProp = clsx(
    styles.button,
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
      {!!icon && <span className={styles.icon}>{icon}</span>}
      {(caption || children) && (
        <span className={styles.caption}>{caption || children}</span>
      )}
      {!!indicator && <span className={styles.indicator}>{indicator}</span>}
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
