import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './FormRow.module.scss'

interface IFormRowProps {
  children: ReactNode
  label?: string
  className?: string
  labelClassName?: string
  icon?: ReactNode
}

export const FormRow: FC<IFormRowProps> = ({
  children,
  className,
  label,
  labelClassName,
  icon,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && (
        <span className={clsx(styles.label, labelClassName)}>{label}</span>
      )}
      <div className={styles.value}>{children}</div>
    </div>
  )
}
