import React, { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { ButtonProps } from './types'
import styles from './Button.module.scss'

const Button: FC<React.HTMLProps<HTMLAnchorElement> & ButtonProps> = ({
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
      active: active,
      disabled: disabled,
      hidden: hidden,
    },
    className
  )

  const destination = to || href

  const content = (
    <>
      {!!icon && <span className={styles.icon}>{icon}</span>}
      {(caption || children) && <span className={styles.caption}>{caption || children}</span>}
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
    return (
      <Link {...props} href={destination} ref={undefined}>
        {content}
      </Link>
    )
  }

  return React.createElement('button', props, content)
}

export default Button
