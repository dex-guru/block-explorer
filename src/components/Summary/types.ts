import { ReactNode } from 'react'
import { ChartProps } from '../Chart'

export type SummaryStat = {
  title?: ReactNode
  tooltip?: ReactNode
  value: ReactNode
  icon?: ReactNode
}

export type SummaryProps = {
  className?: string
  children?: ReactNode

  charts: ChartProps[]
  stats?: SummaryStat[]
}
