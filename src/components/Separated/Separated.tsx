import { FC } from 'react'
import clsx from 'clsx'
import { SeparatedProps } from './types'
import styles from './Separated.module.scss'

const Separated: FC<SeparatedProps> = ({ children, className }) => {
  if (!children) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {children
          ?.filter((child) => !!child)
          .map((child, idx) => {
            return (
              <li className={styles.item} key={idx}>
                {child}
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default Separated
