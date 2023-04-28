import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Table.module.scss'

interface ICellProps {
  children?: ReactNode | ReactNode[]
  className?: string
  th?: boolean
}

export const Cell: FC<ICellProps> = ({ children, className, th }) => {
  if (th) {
    return <th className={clsx(styles.thcell, className)}>{children}</th>
  }

  return <td className={clsx(styles.tcell, className)}>{children}</td>
}
