import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type OpenWithType = 'address' | 'tx' | 'block' | 'token'

export type OpenWithProps = {
  address: string
  type: OpenWithType
  chainConfig: ChainConfigModel
  className?: string
}
