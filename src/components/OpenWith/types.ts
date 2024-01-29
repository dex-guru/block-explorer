import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { ExplorerData } from '@/constants/explorers'

export type OpenWithType = 'address' | 'tx' | 'block' | 'token'

export type OpenWithProps = {
  address: string
  type: OpenWithType
  chainConfig: ChainConfigModel
  className?: string
  tokenSlug?: string
}

export type OpenWithItemProps = OpenWithProps & {
  explorer: ExplorerData
}
