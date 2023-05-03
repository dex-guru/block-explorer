import { ReactNode } from 'react'
import { TabsProps } from '../Tabs'

export type TabPanelProps<T> = TabsProps<T> & {
  className?: string
  tabsClassName?: string
  children?: ReactNode | ReactNode[]
}
