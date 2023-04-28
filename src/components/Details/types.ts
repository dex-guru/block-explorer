import { ReactNode } from 'react'

export type DetailsProps = {
  title: string
  isOpen?: boolean
  className?: string
  children?: ReactNode | ReactNode[]
}
