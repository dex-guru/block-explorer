import { FC } from 'react'
import { LogoProps } from './types'
import LogoImg from '@/images/logo/logo.svg'
import LogoTxt from '@/images/logo/title.svg'
import styles from './Logo.module.scss'

const Logo: FC<LogoProps> = ({ withText }) => {
  return (
    <div className={styles.container}>
      <LogoImg className={styles.image} />
      {!!withText && <LogoTxt className={styles.text} />}
    </div>
  )
}

export default Logo
