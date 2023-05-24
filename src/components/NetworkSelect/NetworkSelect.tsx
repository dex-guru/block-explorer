import { FC, useState } from 'react'
import Link from 'next/link'
import { IconDown, OutsideClicker } from '..'
import clsx from 'clsx'
import { NetworkSelectProps } from './types'
import styles from './NetworkSelect.module.scss'

const NetworkSelect: FC<NetworkSelectProps> = ({
  current,
  className,
  variants,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!variants.length) {
    return null
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <OutsideClicker
      className={clsx(styles.container, className)}
      onClick={handleClose}
    >
      <div
        className={clsx(styles.body, { [styles.open]: isOpen })}
        onClick={handleClick}
      >
        {current}
        {isOpen && (
          <div className={styles.dropdown}>
            <ul className={styles.list}>
              {variants.map((variant, idx) => {
                return (
                  <li key={idx} className={styles.item}>
                    <Link
                      href={variant.url}
                      className={styles.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {variant.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <IconDown
          className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
        />
      </div>
    </OutsideClicker>
  )
}

export default NetworkSelect
