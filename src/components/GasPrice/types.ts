import { FallbackTransport } from 'viem'
import { PublicClient } from 'wagmi'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'

export type GasPriceType = 'low' | 'avg' | 'high'

export type GasPriceProps = {
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
  publicClient: (value: { chainId?: number }) => PublicClient<FallbackTransport>
  className?: string
  onChange?: (values: {
    base: number
    low: number
    avg: number
    high: number
  }) => void
}
