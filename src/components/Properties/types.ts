import { ReactNode } from 'react'

export type Property = {
  title: string
  tooltip?: ReactNode
  value?: ReactNode
}

export type PropertiesProps = {
  data: Property[]
  className?: string
  isCardChild?: boolean
}
