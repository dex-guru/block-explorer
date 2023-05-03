import React, { FC, ReactNode, useEffect, useRef } from 'react'

const OutsideClicker: FC<{
  onClick: () => void
  children: ReactNode
  className?: string
}> = ({ className, onClick, children }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = (event: Event): void => {
    if (!event.target || !ref?.current?.contains(event.target as Node)) {
      onClick()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

export default OutsideClicker
