import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  ContractCreatorModel,
  TokenBalancesStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'

export interface IContractViewProps {
  address: string
  tab: string | string[] | undefined
  addressInfo: AddressModel
  chain?: {
    stats?: ChainStatsModel
    config?: ChainConfigModel
  }
  contractCreator?: ContractCreatorModel
  tokenHoldingsStats?: TokenHoldingsStatsModel
  balancesStats?: TokenBalancesStatsModel
}
