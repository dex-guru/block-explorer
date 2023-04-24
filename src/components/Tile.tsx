import { FC, ReactNode, createElement } from 'react'
import Avatar, { AvatarType } from './Avatar'
import classNames from 'classnames'
import Link from 'next/link'

const Tile: FC<{
  title: ReactNode
  prefix?: ReactNode
  postfix?: ReactNode
  icon?: ReactNode
  letters?: string
  className?: string
  avatarType?: AvatarType
}> = ({ title, prefix, postfix, icon, letters, avatarType, className }) => {
  const tileClassName = classNames('tile', className)

  return (
    <div className={tileClassName}>
      {' '}
      {(!!icon || !!letters) && (
        <div className="tile__icon">
          <Avatar icon={icon} letters={letters} type={avatarType} />
        </div>
      )}
      <div className="tile__content">
        {!!prefix && <small className="tile__subtitle">{prefix}</small>}{' '}
        <strong className="tile__title">{title}</strong>{' '}
        {!!postfix && <small className="tile__subtitle">{postfix}</small>}
      </div>
    </div>
  )
}

export default Tile
