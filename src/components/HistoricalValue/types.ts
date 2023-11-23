import BigNumber from 'bignumber.js'
import { ChainConfigModel, ChainStatsModel } from '@/__generated__/resolvers-types'

export type HistoricalValueProps = {
  title?: string
  value: number | BigNumber | string
  timestamp: number
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
  className?: string
}
