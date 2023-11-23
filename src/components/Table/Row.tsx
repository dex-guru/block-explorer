import { ForwardedRef, ReactNode, forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Table.module.scss'

interface IRowProps {
  children: ReactNode | ReactNode[]
  className?: string
  onClick?: () => void
}

export const Row = forwardRef(function Row(
  props: IRowProps,
  ref: ForwardedRef<HTMLTableRowElement>
) {
  return (
    <tr ref={ref} className={clsx(styles.trow, props.className)}>
      {props.children}
    </tr>
  )
})
