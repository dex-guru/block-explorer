import { FC } from 'react'
import clsx from 'clsx'
import { LabelProps } from './types'
import styles from './Label.module.scss'

const Label: FC<LabelProps> = ({
  title,
  className,
  type = 'tag',
  children,
}) => {
  return (
    <span className={clsx(styles.container, styles[type], className)}>
      {title || children}
    </span>
  )
}

export default Label
