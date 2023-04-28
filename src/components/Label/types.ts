import { ReactNode } from 'react'

export type LabelProps = {
  title?: string
  className?: string
  children?: ReactNode | ReactNode[]
  type?: 'tag' | 'accent'
}
