import { FC } from 'react'
import clsx from 'clsx'
import Heading from '../Heading'
import { EmptyProps } from './types'
import styles from './Empty.module.scss'

const Empty: FC<EmptyProps> = ({
  icon,
  title,
  subtitle,
  className,
  children,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      {!!icon && <div className={styles.icon}>{icon}</div>}
      {(!!title || !!subtitle) && (
        <div className={styles.header}>
          {!!title && (
            <Heading size="md" caption={title} className={styles.title} />
          )}
          {!!subtitle && (
            <Heading size="sm" caption={subtitle} className={styles.subtitle} />
          )}
        </div>
      )}
      {!!children && <div className={styles.body}>{children}</div>}
    </div>
  )
}

export default Empty
