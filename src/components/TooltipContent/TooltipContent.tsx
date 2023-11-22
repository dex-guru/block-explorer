import { CSSProperties, FC } from 'react'
import clsx from 'clsx'
import Heading from '../Heading'
import { TooltipContentProps } from './types'
import styles from './TooltipContent.module.scss'

const TooltipContent: FC<TooltipContentProps> = ({ title, entries, children }) => {
  if (!entries && !children) {
    return null
  }

  return (
    <div className={styles.container}>
      {!!title && <Heading size="xs" caption={title} className={styles.title} />}
      {!!entries?.length && (
        <ul className={styles.list}>
          {entries.map((item, idx) => {
            return (
              <li
                key={idx}
                className={clsx(styles.item, {
                  [styles.hasColor]: !!item.color,
                })}
                style={{ '--color': item.color } as CSSProperties}>
                <strong className={styles.key}>{item.title}</strong>{' '}
                <span className={styles.value}>{item.value}</span>
              </li>
            )
          })}
        </ul>
      )}
      {children}
    </div>
  )
}

export default TooltipContent
