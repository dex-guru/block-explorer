import { FC, ReactNode } from 'react'
import clsx from 'clsx'

interface IRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const Row: FC<IRowProps> = ({ children, className }) => {
  return <tr className={clsx(className, 'row')}>{children}</tr>
}
