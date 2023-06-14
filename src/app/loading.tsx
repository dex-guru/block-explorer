import { FC } from 'react'
import { Loading as Loader } from '@/components'
import styles from './Pages.module.scss'

const Loading: FC = () => {
  return <Loader className={styles.pageLoader} />
}

export default Loading
