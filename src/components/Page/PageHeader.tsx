import { FC } from 'react'
import Link from 'next/link'
import Logo from '../Logo'
import Search from '../Search'
import ThemeToggle from '../ThemeToggle'
import { PageHeaderProps } from './types'
import styles from './PageHeader.module.scss'

const PageHeader: FC<PageHeaderProps> = ({ withMenu, withSearch }) => {
  return (
    <header className={styles.container}>
      <Link className={styles.logo} href="/">
        <Logo withText />
      </Link>
      {!!withMenu && <div className={styles.menu}></div>}
      {!!withSearch && (
        <div className={styles.search}>
          <Search className={styles.searchElement} />
        </div>
      )}
      <div className={styles.theme}>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default PageHeader
