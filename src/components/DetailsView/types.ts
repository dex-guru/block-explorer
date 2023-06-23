import { ReactNode } from 'react'
import { OpenWithType } from '../OpenWith/types'
import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type DetailsViewProps = {
  title: ReactNode
  address?: string
  icon?: ReactNode
  tag?: string
  children?: ReactNode | ReactNode[]
  className?: string
  type?: OpenWithType
  chainConfig?: ChainConfigModel
  titleIndicator?: ReactNode
}
