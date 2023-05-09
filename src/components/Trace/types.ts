import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type Trace = {
  from: string
  gas: string
  gasUsed: string
  input: string
  output: string
  to: string
  type: string
  value: string
  calls?: Trace[]
}

export type TraceProps = { data: Trace; chainConfig: ChainConfigModel }
