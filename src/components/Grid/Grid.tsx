import { FC } from 'react'

import clsx from 'clsx'

import { GridProps } from './types'

import styles from './Grid.module.scss'

const Grid: FC<GridProps> = ({ className, children }) => {
  return <div className={clsx(styles.container, className)}>{children}</div>
}

export default Grid
