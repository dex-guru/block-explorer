import { TransactionModel } from '@/__generated__/resolvers-types'

export interface IAddressViewProps {
  address: string
  tab: string | string[] | undefined
  transactions?: TransactionModel[]
}
