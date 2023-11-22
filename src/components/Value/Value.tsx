import { FC } from 'react'
import clsx from 'clsx'
import { ValueProps } from './types'
import Delta from '@/components/Delta'
import styles from './Value.module.scss'

const Value: FC<ValueProps> = ({
  value,
  icon,
  prefix,
  suffix,
  tooltip,
  className,
  children,
  delta,
}) => {
  return (
    <span
      className={clsx(styles.container, className)}
      data-tooltip-id={tooltip ? 'app-tooltip' : undefined}
      data-tooltip-content={tooltip}>
      {!!icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>
        {!!prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.value}>{value || children}</span>
        {!!suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
      {!!delta && <Delta value={delta} className={styles.delta} />}
    </span>
  )
}

export default Value
