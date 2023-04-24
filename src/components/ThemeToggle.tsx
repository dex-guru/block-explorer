import { FC } from 'react'

export enum Theme {
  light = 'light',
  dark = 'dark',
}

const ThemeToggle: FC<{ onChange: (theme: Theme) => void }> = ({
  onChange,
}) => {
  return (
    <div className="page-header__theme">
      <label className="page-theme">
        <input
          className="page-theme__control"
          onChange={(e) => {
            const value = !!e.target?.checked ? Theme.dark : Theme.light
            onChange(value)
          }}
        />
        <span className="page-theme__caption">
          <span className="caption"></span>
        </span>
      </label>
    </div>
  )
}

export default ThemeToggle
