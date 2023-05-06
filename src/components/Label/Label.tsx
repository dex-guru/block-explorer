import { FC } from 'react'
import clsx from 'clsx'
import { LabelProps } from './types'
import styles from './Label.module.scss'

const Label: FC<LabelProps> = ({
  title,
  className,
  type = 'tag',
  children,
  tooltip,
}) => {
  if (!title && !children) {
    return null
  }

  const tooltipData = tooltip
    ? {
        'data-tooltip-id': 'app-tooltip',
        'data-tooltip-content': tooltip,
      }
    : {}

  return (
    <span
      className={clsx(styles.container, styles[type], className)}
      {...tooltipData}
    >
      {title || children}
    </span>
  )
}

export default Label
