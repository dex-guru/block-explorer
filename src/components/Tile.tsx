import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import Avatar, { AvatarType } from './Avatar'

const Tile: FC<{
  title: ReactNode
  prefix?: ReactNode
  postfix?: ReactNode
  letters?: string
  className?: string
  avatarType?: AvatarType
}> = ({ title, prefix, postfix, letters, avatarType, className }) => {
  const tileClassName = clsx('tile', className)

  return (
    <div className={tileClassName}>
      {' '}
      {!!letters && (
        <div className="tile__icon">
          <Avatar letters={letters} type={avatarType} />
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
