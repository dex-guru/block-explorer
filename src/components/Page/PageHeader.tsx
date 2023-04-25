import { FC, useEffect } from 'react'
import clsx from 'clsx'
import Logo from '../Logo'
import Search from '../Search'
import ThemeToggle, { Theme } from '../ThemeToggle'
import { PageHeaderProps } from './types'
import styles from './PageHeader.module.scss'

const PageHeader: FC<PageHeaderProps> = ({ withMenu, withSearch }) => {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <Logo withText />
      </div>
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
