import { FC, useEffect, useRef } from 'react'
import jazzicon from '@metamask/jazzicon'
import clsx from 'clsx'
import { AvatarProps } from './types'
import styles from './Avatar.module.scss'

const Avatar: FC<AvatarProps> = ({
  address,
  letters,
  className,
  type = 'smooth',
}) => {
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = avatarRef.current

    if (!element) {
      return
    }

    if (element.firstChild) {
      element.removeChild(element.firstChild)
    }

    if (address) {
      const addr = address?.slice(2, 10)
      const seed = parseInt(addr, 16)
      const icon = jazzicon(32, seed)

      element.appendChild(icon)
    }
  }, [address, avatarRef])

  return (
    <div
      className={clsx(styles.container, styles[type], className)}
      data-letters={letters}
    >
      {!!address && <div className={styles.icon} ref={avatarRef} />}
    </div>
  )
}

export default Avatar
