import LogoImg from '../../images/logo/logo.svg'
import LogoTxt from '../../images/logo/title.svg'
import { FC } from 'react'

const Logo: FC<{ withText?: boolean }> = ({ withText }) => {
  return (
    <div className="logo">
      <LogoImg className="logo__image" />
      {!!withText && <LogoTxt className="logo__text" />}
    </div>
  )
}

export default Logo
