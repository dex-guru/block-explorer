import { FallbackTransport } from 'viem'
import { PublicClient } from 'wagmi'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'

export type GasPriceType = 'low' | 'avg' | 'high' | 'standart'

export type GasPriceValue = {
  base: number
  low?: number
  avg?: number
  high?: number
}

export type GasPriceProps = {
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
  publicClient: (value: { chainId?: number }) => PublicClient<FallbackTransport>
  className?: string
  onChange?: (value: GasPriceValue) => void
}
