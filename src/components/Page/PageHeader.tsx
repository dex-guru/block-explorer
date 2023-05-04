import { FC } from 'react'
import Logo from '../Logo'
import Search from '../Search'
import { PageHeaderProps } from './types'
import styles from './PageHeader.module.scss'

const PageHeader: FC<PageHeaderProps> = ({ withMenu, withSearch }) => {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Logo title={process.env.explorerName} to="/" />
      </div>
      {!!withMenu && <div className={styles.menu}></div>}
      {!!withSearch && (
        <div className={styles.search}>
          <Search className={styles.searchElement} />
        </div>
      )}
      {/* <div className={styles.theme}>
        <ThemeToggle />
      </div> */}
    </header>
  )
}

export default PageHeader
