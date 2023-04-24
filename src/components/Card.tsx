import React, { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Button, { ButtonProps } from './Button'
import { Heading } from './Heading'

export const Card: FC<{
  className?: string
  title?: ReactNode
  subtitle?: ReactNode
  children?: React.ReactNode
  actions?: ButtonProps[]
}> = ({ className, title, subtitle, actions, children }) => {
  return (
    <div
      className={clsx('card', {
        [`${className}`]: !!className,
      })}
    >
      {(title || subtitle) && (
        <div className="card__header">
          {title && (
            <Heading size="md" className="card__title">
              {title}
            </Heading>
          )}
          {subtitle && <span className="card__subtitle">{subtitle}</span>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {!!actions && (
        <div className="card__footer">
          <div className="card__actions">
            {actions.map((button, idx) => {
              return (
                <Button
                  key={idx}
                  {...button}
                  className={clsx('card__action', button.className)}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
export default Card
