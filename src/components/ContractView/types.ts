import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'

export interface IContractViewProps {
  address: string
  tab: string | string[] | undefined
  type?: 'token' | 'contract'
  addressInfo: AddressModel
  chain: {
    stats: ChainStatsModel
    config: ChainConfigModel
  }
  tokenHoldingsStats?: TokenHoldingsStatsModel
}
