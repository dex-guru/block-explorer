import { FC } from 'react'
import clsx from 'clsx'
import { TileProps } from './types'
import styles from './Tile.module.scss'

const Tile: FC<TileProps> = ({ title, prefix, postfix, icon, className, children }) => {
  return (
    <div className={clsx(styles.container, className)}>
      {!!icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.body}>
        {!!prefix && <small className={styles.subtitle}>{prefix} </small>}
        {!!title && <strong className={styles.title}>{title} </strong>}
        {!!children && <div className={styles.content}>{children}</div>}
        {!!postfix && <small className={styles.subtitle}> {postfix}</small>}
      </div>
    </div>
  )
}

export default Tile
