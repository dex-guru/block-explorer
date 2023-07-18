import React, { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react'

const OutsideClicker: FC<{
  onClick: (e: Event) => void
  children: ReactNode
  className?: string
  style?: CSSProperties
  element?: string
}> = ({ className, onClick, children, style, element = 'div' }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (event: Event): void => {
    if (!event.target || !ref?.current?.contains(event.target as Node)) {
      onClick(event)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return React.createElement(element, { ref, className, style }, children)
}

export default OutsideClicker
