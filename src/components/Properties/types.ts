import { ReactNode } from 'react'

import { CardProps } from '../Card'

export type Property = {
  title: ReactNode
  tooltip?: ReactNode
  value?: ReactNode
  header?: ReactNode
}

export type PropertiesProps = CardProps & {
  data: Property[]
}
