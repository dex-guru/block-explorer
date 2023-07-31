import { FC } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import clsx from 'clsx'
import { AvatarProps } from './types'
import styles from './Avatar.module.scss'

const Avatar: FC<AvatarProps> = ({
  address,
  letters,
  className,
  type = 'smooth',
}) => {
  return (
    <div
      className={clsx(styles.container, styles[type], className)}
      data-letters={letters}
    >
      {!!address && (
        <div className={styles.icon}>
          <Jazzicon diameter={32} seed={jsNumberForAddress(address)} />
        </div>
      )}
    </div>
  )
}

export default Avatar
