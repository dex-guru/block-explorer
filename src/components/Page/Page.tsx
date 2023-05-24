import { CSSProperties, FC } from 'react'
import PageFooter from './PageFooter'
import PageHeader from './PageHeader'
import { PageProps } from './types'
import { hexToHsl } from '@/lib/utils'
import styles from './Page.module.scss'

const Page: FC<PageProps> = ({ withMenu, children, chainConfig }) => {
  const [h, s, l] = hexToHsl(chainConfig.chainColor)

  return (
    <div
      className={styles.container}
      style={
        {
          '--color-accent-base-h': `${h * 360}`,
          '--color-accent-base-s': `${s * 100}%`,
          '--color-accent-base-l': `${l * 100}%`,
        } as CSSProperties
      }
    >
      <div className={styles.header}>
        <PageHeader withMenu={withMenu} chainConfig={chainConfig} />
      </div>
      <div className={styles.body}>{children}</div>
      <div className={styles.footer}>
        <PageFooter />
      </div>
    </div>
  )
}

export default Page
