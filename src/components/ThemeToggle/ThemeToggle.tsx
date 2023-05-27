import { ChangeEventHandler, FC } from 'react'
import clsx from 'clsx'
import { Theme, ThemeToggleProps } from './types'
import styles from './ThemeToggle.module.scss'

export const THEME_STORAGE_NAME = 'blockExplorerSelectedTheme'

const getCurrentTheme = (): string => {
  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue('content')
    .replace(/"/g, '')

  return value
}

const ThemeToggle: FC<ThemeToggleProps> = ({ className, onChange }) => {
  const doThemeChange = (value: Theme): void => {
    document.documentElement.classList.remove('theme-dark', 'theme-light')
    document.documentElement.classList.add(`theme-${value}`)
  }

  const savedTheme = localStorage.getItem(THEME_STORAGE_NAME)
  const currentTheme = savedTheme || getCurrentTheme()
  doThemeChange(currentTheme as Theme)

  const handleThemeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target?.checked ? Theme.dark : Theme.light

    localStorage.setItem(THEME_STORAGE_NAME, value)

    onChange && onChange(value)
    doThemeChange(value)
  }

  return (
    <label className={clsx('theme-toggle', styles['theme-toggle'], className)}>
      <input
        type="checkbox"
        defaultChecked={currentTheme === Theme.dark}
        className={clsx(
          'theme-toggle__control',
          styles['theme-toggle__control']
        )}
        onChange={handleThemeChange}
      />
    </label>
  )
}

export default ThemeToggle
