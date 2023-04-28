import { FC } from 'react'
import { LogoProps } from './types'
import LogoImg from '@/images/logo/logo.svg'
import styles from './Logo.module.scss'

const Logo: FC<LogoProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <LogoImg className={styles.image} />
      {!!title && <strong className={styles.title}>{title}</strong>}
    </div>
  )
}

export default Logo
