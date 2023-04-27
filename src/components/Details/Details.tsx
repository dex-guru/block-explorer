import { FC } from 'react'
import clsx from 'clsx'
import Heading from '../Heading'
import { DetailsProps } from './types'
import IconArrow from '@/images/icons/arrow-down.svg'
import styles from './Details.module.scss'

const Details: FC<DetailsProps> = ({ title, isOpen, className, children }) => {
  return (
    <details className={clsx(styles.container, className)} open={isOpen}>
      <summary className={styles.header}>
        <Heading caption={title} size="sm" className={styles.title} />
        <IconArrow className={styles.arrow} />
      </summary>
      <div className={styles.body}>{children}</div>
    </details>
  )
}

export default Details
