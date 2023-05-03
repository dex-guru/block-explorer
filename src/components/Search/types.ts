import {
  AddressModel,
  BlockModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'

export type SearchResults = {
  query: string
  addresses?: AddressModel[]
  blocks?: BlockModel[]
  transactions?: TransactionModel[]
}

export type SearchVariantsProps = {
  data: SearchResults | null
  className?: string
}

export type SearchProps = {
  showFilter?: boolean
  withQR?: boolean
  query?: string
  className?: string
}
