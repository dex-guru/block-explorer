import { FC } from 'react'
import Logo from '../Logo'
import Search from '../Search'
import InfoBlock from './InfoBlock'
import PageMenu from './PageMenu'
import { PageHeaderProps } from './types'
import styles from './PageHeader.module.scss'

const PageHeader: FC<PageHeaderProps> = ({ withMenu = true, withSearch }) => {
  return (
    <header className={styles.container}>
      <InfoBlock />
      <div className={styles.main}>
        <div className={styles.logo}>
          <Logo title={process.env.explorerName} to="/" />
        </div>
        {!!withSearch && (
          <div className={styles.search}>
            <Search className={styles.searchElement} />
          </div>
        )}
        {!!withMenu && (
          <PageMenu
            className={styles.menu}
            links={[
              { caption: 'Home', href: '/' },
              { caption: 'CSR', href: '/csr' },
              { caption: 'Verify Contract', href: '/verifyContract' },
              {
                caption: 'API',
                href: 'https://developers.dex.guru/',
              },
              {
                caption: 'Dex Metrics',
                href: 'https://dex.guru/markets?chain=canto',
              },
            ]}
          />
        )}
        {/* <div className={styles.theme}>
        <ThemeToggle />
      </div> */}
      </div>
    </header>
  )
}

export default PageHeader
