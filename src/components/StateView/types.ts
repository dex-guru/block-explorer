import { ReactNode } from 'react'

import { ButtonProps } from '../Button'

export type StateViewProps = {
  icon?: ReactNode
  illustration?: ReactNode
  title?: ReactNode
  subtitle?: ReactNode
  className?: string
  actions?: ButtonProps[]
  children?: ReactNode | ReactNode[]
}
