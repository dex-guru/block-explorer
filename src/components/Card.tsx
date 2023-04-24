import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

import { Heading } from './Heading'
import Button, { ButtonProps } from './Button'

export const Card: FC<{
  className?: string
  title?: ReactNode
  subtitle?: ReactNode
  children?: React.ReactNode
  actions?: ButtonProps[]
}> = ({ className, title, subtitle, actions, children }) => {
  return (
    <div
      className={classNames('card', {
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
            {actions.map((button) => {
              return (
                <Button
                  {...button}
                  className={classNames('card__action', button.className)}
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
