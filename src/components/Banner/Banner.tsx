import { FC } from 'react'
import { BannerProps } from './types'
import styles from './Banner.module.scss'

const Banner: FC<BannerProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {' '}
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default Banner
