import { FC, ReactNode } from 'react'
import clsx from 'clsx'
import { MessageProps, MessageType } from './types'
import { Button } from '@/components'
import IconInfo from '@/images/icons/info.svg'
import styles from './Message.module.scss'

const icons: Record<MessageType, ReactNode> = {
  info: <IconInfo className={styles.icon} />,
  danger: <IconInfo className={styles.icon} />,
  success: <IconInfo className={styles.icon} />,
  warn: <IconInfo className={styles.icon} />,
  prompt: <IconInfo className={styles.icon} />,
}

const Message: FC<MessageProps> = ({
  text,
  type,
  className,
  children,
  actions,
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
    <div
      className={clsx(styles.container, type ? styles[type] : '', className)}
    >
      <div className={styles.icon}>{icons[type || 'info']}</div>

      <div className={styles.body}>{text || children}</div>
      {!!actions && <div className={styles.footer}>{renderActions()}</div>}
    </div>
  )
}

export default Message
