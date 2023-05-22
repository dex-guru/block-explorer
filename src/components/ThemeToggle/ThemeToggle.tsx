import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Theme, ThemeToggleProps } from './types'
import styles from './ThemeToggle.module.scss'

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

  const handleThemeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target?.checked ? Theme.dark : Theme.light

    onChange && onChange(value)
    doThemeChange(value)
  }

  return (
    <label className={clsx('theme-toggle', styles['theme-toggle'], className)}>
      <input
        type="checkbox"
        defaultChecked={getCurrentTheme() === Theme.dark}
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
