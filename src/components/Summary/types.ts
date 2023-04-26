import { ReactNode } from 'react'
import { ChartProps } from '../Chart'

export type SummaryProps = {
  className?: string
  children?: ReactNode

  charts: ChartProps[]
}
