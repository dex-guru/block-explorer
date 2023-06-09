import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'

export interface IAddressViewProps {
  address: string
  tab: string | null
  addressInfo: AddressModel | null
  chain: {
    stats: ChainStatsModel
    config: ChainConfigModel
  }
  tokenHoldingsStats?: TokenHoldingsStatsModel
}
