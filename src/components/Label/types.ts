import { ReactNode } from 'react'

export type LabelProps = {
  title?: string
  className?: string
  children?: ReactNode
  type?: 'tag' | 'accent'
}
