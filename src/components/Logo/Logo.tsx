import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoProps } from './types'
import ImgBlockExplorer from '@/images/blockexplorer.svg'
import styles from './Logo.module.scss'

const Logo: FC<LogoProps> = ({ title, to, url }) => {
  const content = (
    <div className={styles.container}>
      <Image
        src={url}
        className={styles.image}
        alt="Logo"
        width={32}
        height={32}
      />
      {!!title && (
        <div className={styles.content}>
          <strong className={styles.title}>{title} Explorer</strong>{' '}
          <span className={styles.subtitle}>
            <ImgBlockExplorer className={styles.explorer} />
            by DexGuru
          </span>
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
