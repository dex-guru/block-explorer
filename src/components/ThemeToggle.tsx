import { FC } from 'react'
import classNames from 'classnames'

export enum Theme {
  light = 'light',
  dark = 'dark',
}

export type ThemeValue = {
  title: string
}

export const ThemeValues: Record<Theme, ThemeValue> = {
  light: {
    title: 'Light',
  },
  dark: {
    title: 'Dark',
  },
}

const ThemeToggle: FC<{
  className?: string
  onChange: (theme: Theme) => void
}> = ({ className, onChange }) => {
  return (
    <label className={classNames('theme-toggle', className)}>
      <input
        type="checkbox"
        className="theme-toggle__control"
        onChange={(e) => {
          onChange(!!e.target?.checked ? Theme.dark : Theme.light)
        }}
      />
      <span className="theme-toggle__caption">
        <span className="caption"></span>
      </span>
    </label>
  )
}

export default ThemeToggle
