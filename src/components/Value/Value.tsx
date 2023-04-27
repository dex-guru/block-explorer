import { FC } from 'react'
import { ValueProps } from './types'
import styles from './Value.module.scss'

const Value: FC<ValueProps> = ({ value, icon, prefix, postfix, children }) => {
  return (
    <span className={styles.container}>
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
