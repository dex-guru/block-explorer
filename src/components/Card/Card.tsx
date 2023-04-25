import React, { FC } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import Heading from '../Heading'
import { CardProps } from './types'
import styles from './Card.module.scss'

export const Card: FC<CardProps> = ({
  isHalf,
  className,
  title,
  subtitle,
  actions,
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
    <div
      className={clsx(styles.container, { [styles.half]: isHalf }, className)}
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && (
            <Heading size="md" className={styles.title}>
              {title}
            </Heading>
          )}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
      {!!actions && (
        <div className={styles.footer}>
          <div className={styles.actions}>{renderActions()}</div>
        </div>
      )}
    </div>
  )
}
export default Card
