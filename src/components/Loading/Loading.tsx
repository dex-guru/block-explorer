import { FC } from 'react'
import styles from './Loading.module.scss'

const Loading: FC = () => {
  return <progress className={styles.progress} />
}

export default Loading
