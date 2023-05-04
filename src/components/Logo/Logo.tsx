import { FC } from 'react'
import Link from 'next/link'
import { LogoProps } from './types'
import LogoImg from '@/images/logo/logo.svg'
import styles from './Logo.module.scss'

const Logo: FC<LogoProps> = ({ title, to }) => {
  const content = (
    <div className={styles.container}>
      <LogoImg className={styles.image} />
      {!!title && (
        <div className={styles.content}>
          <strong className={styles.title}>{title}</strong>{' '}
          <span className={styles.subtitle}>by DexGuru</span>
        </div>
      )}
    </div>
  )

  if (to) {
    return (
      <Link href={to} className={styles.link}>
        {content}
      </Link>
    )
  }

  return content
}

export default Logo
