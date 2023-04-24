import { FC, ReactNode } from 'react'
import classNames from 'classnames'

export type AvatarType = 'square' | 'smooth' | 'rounded'

const Avatar: FC<{
  type?: AvatarType
  icon?: ReactNode
  letters?: string
  className?: string
}> = ({ icon, letters, className, type = 'square' }) => {
  return (
    <div
      className={classNames('avatar', `avatar--${type}`, className)}
      data-letters={letters}
    >
      {!!icon && (
        <div className="avatar__icon">
          <div className="icon">{icon}</div>
        </div>
      )}
    </div>
  )
}

export default Avatar
