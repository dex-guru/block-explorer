import { FC } from 'react'
import clsx from 'clsx'
import { ValueProps } from './types'
import { Delta } from '@/components'
import styles from './Value.module.scss'

const Value: FC<ValueProps> = ({
  value,
  icon,
  prefix,
  suffix,
  className,
  children,
  delta,
}) => {
  return (
    <span className={clsx(styles.container, className)}>
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
