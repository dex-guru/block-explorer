import { ReactNode } from 'react'
import { ButtonProps } from '../Button'

export type CardProps = {
  className?: string
  title?: ReactNode
  subtitle?: ReactNode
  children?: React.ReactNode
  actions?: ButtonProps[]
}
