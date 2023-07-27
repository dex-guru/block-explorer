import { ReactNode } from 'react'

export type ValueProps = {
  value?: ReactNode
  tooltip?: string
  children?: ReactNode | ReactNode[]
  icon?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  className?: string
  delta?: number
}
