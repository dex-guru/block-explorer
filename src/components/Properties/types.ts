import { ReactNode } from 'react'
import { CardProps } from '../Card'

export type Property = {
  title: string
  tooltip?: ReactNode
  value?: ReactNode
}

export type PropertiesProps = CardProps & {
  data: Property[]
}
