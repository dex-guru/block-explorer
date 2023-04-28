import { TransactionModel } from '@/__generated__/resolvers-types'

export interface IContractViewProps {
  address: string
  tab: string | string[] | undefined
  transactions?: TransactionModel[]
}
