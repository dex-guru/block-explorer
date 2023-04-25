import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import clsx from 'clsx'
import { Theme, ThemeToggleProps } from './types'
import styles from './ThemeToggle.module.scss'

const ThemeToggle: FC<ThemeToggleProps> = ({ className, onChange }) => {
  const [initialValue, setInitialValue] = useState<string>('')

  const doThemeChange = (value: Theme): void => {
    document.documentElement.classList.remove('theme-dark', 'theme-light')
    document.documentElement.classList.add(`theme-${value}`)
  }

  useEffect(() => {
    const value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('content')
      .replace(/"/g, '')

    setInitialValue(value)

    if (value) {
      doThemeChange(value === Theme.dark ? Theme.dark : Theme.light)
    }
  }, [])

  const handleThemeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = !!e.target?.checked ? Theme.dark : Theme.light

    onChange && onChange(value)
    doThemeChange(value)
  }

  return (
    <label className={clsx('theme-toggle', styles['theme-toggle'], className)}>
      <input
        type="checkbox"
        defaultChecked={initialValue === Theme.dark ? true : false}
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
