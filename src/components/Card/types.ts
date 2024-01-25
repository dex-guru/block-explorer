import { CSSProperties, ReactNode } from 'react'

import { ButtonProps } from '../Button'

export type CardProps = {
  className?: string
  title?: ReactNode
  children?: React.ReactNode
  actions?: ButtonProps[]
  header?: ReactNode
  footer?: ReactNode
  style?: CSSProperties
}
