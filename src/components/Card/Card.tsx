import React, { FC } from 'react'
import clsx from 'clsx'
import { CardProps } from './types'
import Button from '@/components/Button'
import Heading from '@/components/Heading'
import styles from './Card.module.scss'

export const Card: FC<CardProps> = ({
  className,
  title,
  header,
  actions,
  footer,
  style,
  children,
}) => {
  const renderActions = () => {
    return actions?.map((button, idx) => {
      return (
        <Button
          key={idx}
          {...button}
          className={clsx(styles.action, button.className)}
        />
      )
    })
  }

  return (
    <div className={clsx(styles.container, className)} style={style}>
      {(!!title || !!header) && (
        <div className={styles.header}>
          {title && (
            <Heading size="md" className={styles.title}>
              {title}
            </Heading>
          )}
          {!!header && <div className={styles.headerContent}>{header}</div>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {(!!actions || !!footer) && (
        <div className={styles.footer}>
          {!!actions && <div className={styles.actions}>{renderActions()}</div>}
          {footer}
        </div>
      )}
    </div>
  )
}
export default Card
