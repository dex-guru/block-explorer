import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './Table.module.scss'

interface IRowProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const Row: FC<IRowProps> = ({ children, className }) => {
  return <tr className={clsx(styles.trow, className)}>{children}</tr>
}
