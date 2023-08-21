import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type EnsNameProp = {
  address: string
  chainConfig: ChainConfigModel
  className?: string
  isTag?: boolean
}
