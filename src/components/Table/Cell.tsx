import { FC, ReactNode } from 'react'
import clsx from 'clsx'

interface ICellProps {
  children: ReactNode
  className?: string
  th?: boolean
}

export const Cell: FC<ICellProps> = ({ children, className, th }) => {
  if (th) {
    return <th className={clsx(className, 'cell-header')}>{children}</th>
  }
  return <td className={clsx(className, 'cell')}>{children}</td>
}
