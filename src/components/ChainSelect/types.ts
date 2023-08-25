import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type ChainSelectProps = {
  className?: string
  chainConfig: ChainConfigModel
  urlGenerator?: (chain: ChainConfigModel) => string
}
