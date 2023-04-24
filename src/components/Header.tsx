import { FC } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import Search from './Search'

const Header: FC<{ withMenu?: boolean; withSearch?: boolean }> = ({
  withMenu,
  withSearch,
}) => {
  return (
    <header className="page-header">
      <div className="page-header__logo">
        <Logo withText />
      </div>
      {!!withMenu && <div className="page-header__menu"></div>}
      {!!withSearch && (
        <div className="page-header__search">
          <Search className="page-header-search" />
        </div>
      )}
      <div className="page-header__theme">
        <ThemeToggle
          onChange={() => {
            //
          }}
        />
      </div>
    </header>
  )
}

export default Header
