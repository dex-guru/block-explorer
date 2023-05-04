import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
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
}
