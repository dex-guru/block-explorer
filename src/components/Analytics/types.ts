import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type AnalyticsProps = {
  chainConfig: ChainConfigModel
  tag: string
  params?: Record<string, unknown>
  className?: string
}
