import { FC, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { getJazzIcon } from './helpers'
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
      element.appendChild(getJazzIcon(address))
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
