import { FC } from 'react'
import clsx from 'clsx'
import { CodeProps } from './types'
import styles from './Code.module.scss'

const Code: FC<CodeProps> = ({ children, className }) => {
  return (
    <pre className={clsx(styles.container, className)}>
      <code className={styles.code}>{children}</code>
    </pre>
  )
}
export default Code
