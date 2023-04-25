import { FC } from 'react'
import clsx from 'clsx'
import Avatar from '../Avatar'
import { TileProps } from './types'
import styles from './Tile.module.scss'

const Tile: FC<TileProps> = ({
  title,
  prefix,
  postfix,
  letters,
  avatarType,
  className,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      {!!letters && (
        <div className={styles.icon}>
          <Avatar letters={letters} type={avatarType} />
        </div>
      )}
      <div className={styles.content}>
        {!!prefix && <small className={styles.subtitle}>{prefix}</small>}{' '}
        <strong className={styles.title}>{title}</strong>{' '}
        {!!postfix && <small className={styles.subtitle}>{postfix}</small>}
      </div>
    </div>
  )
}

export default Tile
