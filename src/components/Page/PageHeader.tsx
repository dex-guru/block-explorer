import { FC } from 'react'
import Logo from '../Logo'
import Search from '../Search'
import InfoBlock from './InfoBlock'
import { PageHeaderProps } from './types'
import styles from './PageHeader.module.scss'

const PageHeader: FC<PageHeaderProps> = ({ withMenu, withSearch }) => {
  return (
    <header className={styles.container}>
      <InfoBlock />
      <div className={styles.main}>
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
      </div>
    </header>
  )
}

export default PageHeader
