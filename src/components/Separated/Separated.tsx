import { FC } from 'react'

import clsx from 'clsx'

import { SeparatedProps } from './types'

import styles from './Separated.module.scss'

const Separated: FC<SeparatedProps> = ({ children, className }) => {
  if (!children) {
    return null
  }

  const arrayChildren = Array.isArray(children) ? children : [children]

  return (
    <div className={clsx(styles.container, className)}>
      <ul className={styles.list}>
        {arrayChildren
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
