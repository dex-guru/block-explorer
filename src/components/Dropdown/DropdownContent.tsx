import { CSSProperties, FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { useDimensionsRef } from 'rooks'
import { DropdownContentProps } from './types'
import { getRootElement } from '@/lib/utils'
import styles from './Dropdown.module.scss'

const DropdownContent: FC<DropdownContentProps> = ({
  toggle,
  className,
  children,
  content,
  isOpen = false,
  onOpen,
  onClose,
  isRight,
}) => {
  const [isCurrentOpen, setIsCurrentOpen] = useState<boolean>(isOpen)
  const [refDropdown, rectDropdown, dropdown] = useDimensionsRef()

  const [isDropdownUp, setIsDropdownUp] = useState(false)
  const [dropdownCoord, setDropdownCoord] = useState<{
    top?: number
    left?: number
    right?: number
    bottom?: number
  } | null>(null)

  useEffect(() => {
    setIsCurrentOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    onOpen && isCurrentOpen && onOpen()
    onClose && !isCurrentOpen && onClose()
  }, [isCurrentOpen, onOpen, onClose])

  useEffect(() => {
    if (!toggle || !rectDropdown) {
      setDropdownCoord(null)
    }

    const rectButton = toggle?.getBoundingClientRect()

    const isTopLimit =
      (rectButton?.bottom || 0) + (rectDropdown?.height || 0) >
      window.innerHeight

    setIsDropdownUp(isTopLimit)

    setDropdownCoord({
      left: isRight
        ? (rectButton?.right || 0) - (rectDropdown?.width || 0)
        : rectButton?.left,
      top: !isTopLimit ? rectButton?.bottom : undefined,
      bottom: isTopLimit
        ? window.innerHeight - (rectButton?.top || 0)
        : undefined,
    })
  }, [rectDropdown, toggle, isRight])

  const handleClickOutside = (event: Event): void => {
    if (
      !event.target ||
      !(
        toggle?.contains(event.target as Node) ||
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

  if (!isCurrentOpen || !dropdownCoord || !(content || children)) {
    return null
  }

  return createPortal(
    <div
      ref={refDropdown}
      className={clsx(
        styles.dropdown,
        className,
        { [styles.up]: isDropdownUp },
        { [styles.down]: !isDropdownUp }
      )}
      style={
        {
          '--coord-left': dropdownCoord?.left
            ? `${dropdownCoord?.left}px`
            : undefined,
          '--coord-top': dropdownCoord?.top
            ? `${dropdownCoord?.top}px`
            : undefined,
          '--coord-bottom': dropdownCoord?.bottom
            ? `${dropdownCoord?.bottom}px`
            : undefined,
          minWidth: toggle?.getBoundingClientRect()?.width || undefined,
        } as CSSProperties
      }
    >
      {children || content}
    </div>,
    getRootElement()
  )
}

export default DropdownContent
