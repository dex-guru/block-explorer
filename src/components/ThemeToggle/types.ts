export enum Theme {
  light = 'light',
  dark = 'dark',
}

export type ThemeValue = {
  title: string
}

export type ThemeToggleProps = {
  className?: string
  onChange?: (theme: Theme) => void
}
