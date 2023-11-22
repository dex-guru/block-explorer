import { FC, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { IconArrowDown } from '../Icons'
import { DropdownProps } from './types'
import styles from './Dropdown.module.scss'

const DropdownContent = dynamic(() => import('./DropdownContent'), {
  ssr: false,
})

const Dropdown: FC<DropdownProps> = ({
  icon,
  caption,
  className,
  isOpen = false,
  onClose,
  onOpen,
  content,
  children,
  ...contentProps
}) => {
  const [isCurrentOpen, setIsCurrentOpen] = useState<boolean>(isOpen)
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsCurrentOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    onOpen && isCurrentOpen && onOpen()
    onClose && !isCurrentOpen && onClose()
  }, [isCurrentOpen, onOpen, onClose])

  const handleClick = () => {
    setIsCurrentOpen(!isCurrentOpen)
  }
  const handleOpen = () => {
    setIsCurrentOpen(true)
  }
  const handleClose = () => {
    setIsCurrentOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className={clsx(styles.button, className, {
          [styles.open]: isCurrentOpen,
        })}
        onClick={handleClick}
        ref={ref}>
        {!!icon && <span className={styles.icon}>{icon}</span>}
        {!!caption && <span className={styles.caption}>{caption}</span>}
        <IconArrowDown className={clsx(styles.arrow, { [styles.arrowOpen]: isCurrentOpen })} />
      </button>

      {isCurrentOpen && (
        <DropdownContent
          {...contentProps}
          className={contentProps.contentClassName}
          toggle={ref.current}
          isOpen={isCurrentOpen}
          onOpen={handleOpen}
          onClose={handleClose}>
          {content || children}
        </DropdownContent>
      )}
    </>
  )
}

export default Dropdown
