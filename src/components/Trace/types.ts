import { ChainConfigModel } from '@/__generated__/resolvers-types'

export type TraceL2Event = {
  from: string | null
  to: string | null
  purpose: string | null
  value: string | null
}

export type TraceL2EventsProps = { title: string; events?: TraceL2Event[] }

export type Trace = Record<string, string> & {
  from: string
  gas: string
  gasUsed: string
  input: string
  output: string
  to: string
  type: string
  value: string
  calls?: Trace[]
  error?: string
  beforeEVMTransfers?: TraceL2Event[]
  afterEVMTransfers?: TraceL2Event[]
}

export type TraceProps = {
  data: unknown & Trace
  chainConfig: ChainConfigModel
}
