import { FC } from 'react'
import { IconNoData } from '..'
import clsx from 'clsx'
import Button, { ButtonProps } from '../Button'
import Empty, { EmptyProps } from '../Empty'
import styles from './Error.module.scss'

const Error: FC<EmptyProps & { actions?: ButtonProps[] }> = ({
  actions,
  children,
  ...props
}) => {
  const renderActions = () => {
    return actions?.map((action, idx) => {
      return (
        <Button
          key={idx}
          {...action}
          className={clsx(styles.action, action.className)}
        />
      )
    })
  }

  return (
    <Empty
      icon={<IconNoData className={styles.icon} />}
      {...props}
      className={clsx(styles.container, props.className)}
    >
      {children}
      {!!actions && <div className={styles.actions}>{renderActions()}</div>}
    </Empty>
  )
}

export default Error
