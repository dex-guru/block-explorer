import { FC } from 'react'
import { LabelProps } from './types'
import styles from './Label.module.scss'

const Label: FC<LabelProps> = ({ title, children }) => {
  return (
    <span className={styles.container}>
      <span className={styles.title}>
        <span className={styles.caption}>{title || children}</span>
      </span>
    </span>
  )
}

export default Label
