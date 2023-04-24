import { FC } from 'react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const Header: FC<{ withMenu?: boolean }> = ({ withMenu }) => {
  return (
    <header className="page-header">
      <div className="page-header__logo">
        <Logo withText />
      </div>
      {!!withMenu && <div className="page-header__menu"></div>}
      <ThemeToggle
        onChange={() => {
          //
        }}
      />
    </header>
  )
}

export default Header
