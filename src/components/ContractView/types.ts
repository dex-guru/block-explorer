import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  ContractCreatorModel,
  TokenBalancesStatsModel,
  TokenHoldingsStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'

export interface IContractViewProps {
  address: string
  tab: string | string[] | undefined
  transactions?: TransactionModel[]
  addressInfo: AddressModel
  chain: {
    stats: ChainStatsModel
    config: ChainConfigModel
  }
  contractCreator?: ContractCreatorModel
  tokenHoldingsStats?: TokenHoldingsStatsModel
  balancesStats: TokenBalancesStatsModel
}
