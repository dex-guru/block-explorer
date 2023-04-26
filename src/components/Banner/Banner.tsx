import { FC } from 'react'
import { BannerProps } from './types'
import styles from './Banner.module.scss'

const Banner: FC<BannerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export default Banner
