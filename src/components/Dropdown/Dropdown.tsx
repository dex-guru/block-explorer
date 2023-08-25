import { FC, LegacyRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useDimensionsRef } from 'rooks'
import { IconArrowDown } from '../Icons'
import { DropdownProps } from './types'
import { getRootElement } from '@/lib/utils'
import styles from './Dropdown.module.scss'

const Dropdown: FC<DropdownProps> = ({
  className,
  contentClassName,
  position = 'absolute',
  icon,
  caption,
  children,
  content,
  isOpen = false,
  onOpen,
  onClose,
}) => {
  const [isCurrentOpen, setIsCurrentOpen] = useState<boolean>(isOpen)
  const [refButton, rectButton, button] = useDimensionsRef()
  const [refDropdown, rectDropdown, dropdown] = useDimensionsRef()
  const [isDropdownUp, setIsDropdownUp] = useState(false)
  const [dropdownCoord, setDropdownCoord] = useState<{
    top: number
    left: number
  } | null>(null)

  useEffect(() => {
    setIsCurrentOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    window.resizeBy(0, 0)
  })

  useEffect(() => {
    const belowPosTop = (rectButton?.top || 0) + (rectButton?.height || 0)
    const topLimit =
      belowPosTop + (rectDropdown?.height || 0) > window.innerHeight
    const top = topLimit
      ? (rectButton?.top || 0) - (rectDropdown?.height || 0)
      : belowPosTop

    setIsDropdownUp(topLimit)

    const dropdownCoord = rectButton
      ? {
          left: rectButton?.left,
          top: top + (position === 'absolute' ? window.scrollY : 0),
        }
      : null

    setDropdownCoord(dropdownCoord)
  }, [rectButton, rectDropdown?.height, position])

  useEffect(() => {
    onOpen && isCurrentOpen && onOpen()
    onClose && !isCurrentOpen && onClose()
  }, [isCurrentOpen, onOpen, onClose])

  const handleClickOutside = (event: Event): void => {
    if (
      !event.target ||
      !(
        button?.contains(event.target as Node) ||
        dropdown?.contains(event.target as Node)
      )
    ) {
      setIsCurrentOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleClick = () => {
    setIsCurrentOpen(!isCurrentOpen)
  }

  const dropdownContent =
    (!!children || !!content) && isCurrentOpen
      ? createPortal(
          <div
            ref={refDropdown}
            className={clsx(
              styles.dropdown,
              styles[position],
              contentClassName,
              { [styles.up]: isDropdownUp },
              { [styles.down]: !isDropdownUp }
            )}
            style={{
              left: dropdownCoord?.left,
              top: dropdownCoord?.top,
              minWidth: rectButton?.width,
            }}
          >
            {children || content}
          </div>,
          getRootElement()
        )
      : null

  return (
    <>
      <button
        type="button"
        className={clsx(styles.button, className, {
          [styles.open]: isCurrentOpen,
        })}
        onClick={handleClick}
        ref={refButton as LegacyRef<HTMLButtonElement>}
      >
        {!!icon && <span className={styles.icon}>{icon}</span>}
        {!!caption && <span className={styles.caption}>{caption}</span>}
        <IconArrowDown
          className={clsx(styles.arrow, { [styles.arrowOpen]: isCurrentOpen })}
        />
      </button>

      {dropdownContent}
    </>
  )
}

export default Dropdown
