import { FC } from 'react'
import clsx from 'clsx'
import { TileProps } from './types'
import styles from './Tile.module.scss'

const Tile: FC<TileProps> = ({ title, prefix, postfix, icon, className }) => {
  return (
    <div className={clsx(styles.container, className)}>
      {!!icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        {!!prefix && <small className={styles.subtitle}>{prefix}</small>}{' '}
        <strong className={styles.title}>{title}</strong>{' '}
        {!!postfix && <small className={styles.subtitle}>{postfix}</small>}
      </div>
    </div>
  )
}

export default Tile
