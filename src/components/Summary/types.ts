import { ReactNode } from 'react'
import { LineChartDataset } from '../LineChart'

export type SummaryStat = {
  title?: ReactNode
  tooltip?: ReactNode
  value: ReactNode
  icon?: ReactNode
}

export type SummaryProps = {
  className?: string
  children?: ReactNode | ReactNode[]

  charts?: {
    title?: string
    data: LineChartDataset[]
    color?: string
    className?: string
  }[]
  stats?: SummaryStat[]
}
