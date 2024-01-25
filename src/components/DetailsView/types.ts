import { ReactNode } from 'react'

import { ChainConfigModel } from '@/__generated__/resolvers-types'

import { OpenWithType } from '../OpenWith/types'

export type DetailsViewProps = {
  title: ReactNode
  address?: string
  icon?: ReactNode
  tags?: ReactNode[]
  ens?: string
  tagTooltip?: string
  header?: ReactNode
  children?: ReactNode | ReactNode[]
  className?: string
  type?: OpenWithType
  chainConfig?: ChainConfigModel
}
