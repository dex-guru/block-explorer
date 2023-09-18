import { FC } from 'react'
import clsx from 'clsx'
import { DetailsProps } from './types'
import Heading from '@/components/Heading'
import { IconArrowDown } from '@/components/Icons'
import styles from './Details.module.scss'

const Details: FC<DetailsProps> = ({
  title,
  isOpen,
  className,
  children,
  onToggle,
}) => {
  return (
    <details
      className={clsx(styles.container, className)}
      open={isOpen}
      onToggle={onToggle}
    >
      <summary className={styles.header}>
        <Heading caption={title} size="sm" className={styles.title} />
        <IconArrowDown className={styles.arrow} />
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  )
}

export default Details
