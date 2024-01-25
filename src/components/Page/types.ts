import { ReactNode } from 'react'

import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type PageHeaderProps = {
  chainConfig: ChainConfigModel
}
export type PageProps = PageHeaderProps & {
  children?: ReactNode | ReactNode[]
}

export type InfoBlockProps = {
  chainConfig: ChainConfigModel
}
