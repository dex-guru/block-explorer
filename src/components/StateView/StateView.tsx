import { FC } from 'react'
import clsx from 'clsx'
import { StateViewProps } from './types'
import Button from '@/components/Button'
import Heading from '@/components/Heading'
import styles from './StateView.module.scss'

const StateView: FC<StateViewProps> = ({
  icon,
  illustration,
  title,
  subtitle,
  className,
  actions,
  children,
}) => {
  const renderActions = () => {
    return actions?.map((action, idx) => {
      return <Button key={idx} {...action} className={clsx(styles.action, action.className)} />
    })
  }

  return (
    <div className={clsx(styles.container, className)}>
      {!!icon && <div className={styles.icon}>{icon}</div>}
      {!!illustration && <div className={styles.illustration}>{illustration}</div>}
      {(!!title || !!subtitle) && (
        <div className={styles.header}>
          {!!title && <Heading size="md" caption={title} className={styles.title} />}
          {!!subtitle && <Heading size="sm" caption={subtitle} className={styles.subtitle} />}
        </div>
      )}
      {!!children && <div className={styles.body}>{children}</div>}
      {!!actions && <div className={styles.actions}>{renderActions()}</div>}
    </div>
  )
}

export default StateView
