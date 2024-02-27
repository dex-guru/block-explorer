import { ReactNode } from 'react'

import { CommonChartDataset } from '../CommonChart'

export type SummaryStat = {
  title?: ReactNode
  tooltip?: ReactNode
  value: ReactNode
  icon?: ReactNode
}

export type SummaryProps = {
  title?: ReactNode
  className?: string
  children?: ReactNode | ReactNode[]

  charts?: {
    title?: string
    data: CommonChartDataset[]
    color?: string
    className?: string
  }[]
  stats?: SummaryStat[]
}
