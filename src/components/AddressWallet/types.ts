import { TokenHoldingsStatsModel } from '@/__generated__/resolvers-types'

export type AddressWalletProps = {
  address: string
  className?: string
  tokenHoldingsStats?: TokenHoldingsStatsModel
}

export type AddressWalletTokensProps = {
  address: string
  className?: string
  coord?: {
    left: number
    top: number
  }
  onClose: (e: Event) => void
}
