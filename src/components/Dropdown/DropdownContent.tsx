import { CSSProperties, FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { DropdownContentProps } from './types'
import useDimensions from '@/hooks/useDimensions'
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
  const { dimensions: rectButton, node: button } = useDimensions({
    target: toggle,
  })
  const {
    dimensions: rectDropdown,
    node: dropdown,
    ref: refDropdown,
  } = useDimensions({
    target: toggle,
    liveMeasure: true,
  })
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
    if (!rectButton) {
      setDropdownCoord(null)
    }

    const isTopLimit =
      (rectButton.bottom || 0) + (rectDropdown?.height || 0) >
      window.innerHeight

    setIsDropdownUp(isTopLimit)

    setDropdownCoord({
      right: isRight ? window.innerWidth - (rectButton?.right || 0) : undefined,
      left: !isRight ? rectButton?.left : undefined,
      top: !isTopLimit ? rectButton?.bottom : undefined,
      bottom: isTopLimit
        ? window.innerHeight - (rectButton?.top || 0)
        : undefined,
    })
  }, [rectButton, rectDropdown, isRight])

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

  if (
    !button ||
    !dropdown ||
    !(content || children) ||
    !isCurrentOpen ||
    !dropdownCoord
  ) {
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
          '--coord-right': dropdownCoord?.right
            ? `${dropdownCoord?.right}px`
            : undefined,
          '--coord-top': dropdownCoord?.top
            ? `${dropdownCoord?.top}px`
            : undefined,
          '--coord-bottom': dropdownCoord?.bottom
            ? `${dropdownCoord?.bottom}px`
            : undefined,
          minWidth: rectButton?.width,
        } as CSSProperties
      }
    >
      {children || content}
    </div>,
    getRootElement()
  )
}

export default DropdownContent
