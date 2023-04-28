import { FC } from 'react'
import clsx from 'clsx'
import { ValueProps } from './types'
import styles from './Value.module.scss'

const Value: FC<ValueProps> = ({
  value,
  icon,
  prefix,
  postfix,
  className,
  children,
}) => {
  return (
    <span className={clsx(styles.container, className)}>
      {!!icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.value}>
        {!!prefix && <span className={styles.prefix}>{prefix}</span>}
        <span className={styles.value}>{value || children}</span>
        {!!postfix && <span className={styles.postfix}>{postfix}</span>}
      </span>
    </span>
  )
}

export default Value
