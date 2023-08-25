import React, { FC, ReactNode, useEffect, useRef } from 'react'

const OutsideClicker: FC<
  React.HTMLProps<HTMLDivElement> & {
    onClose: (e: Event) => void
    children: ReactNode
    element?: string
  }
> = ({ className, onClose, children, style, element = 'div' }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (event: Event): void => {
    if (!event.target || !ref?.current?.contains(event.target as Node)) {
      onClose(event)
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
