import { ReactNode } from 'react'
import { UrlObject } from 'url'

export interface Tab<T> {
  title: string
  value: T
  icon?: ReactNode
  indicator?: ReactNode
  disabled?: boolean
  hidden?: boolean
  className?: string
  onClick?: () => void
  tooltip?: string
  to?: string | UrlObject
  content?: ReactNode
}

export interface TabsProps<T> {
  tabs: Tab<T>[]
  value: T
  onChange?: (value: T, title?: string) => void
  disabled?: boolean
  className?: string
}
