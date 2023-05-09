import { Props as XAxisProps } from 'recharts/types/cartesian/XAxis'
import { Props as YAxisProps } from 'recharts/types/cartesian/YAxis'

export type ChartTuple = { timestamp: number; value: number }

export type LineChartDataset = {
  id: string
  data: ChartTuple[]
  name?: string
  color?: string
  yAxis?: 'left' | 'right'
  className?: string
}

export type LineChartOptions = {
  grid?: boolean
  axis?: {
    y?: YAxisProps
    x?: XAxisProps
  }
  zoom?: boolean
}

export type LineChartProps = {
  data: LineChartDataset[]
  className?: string
  options?: LineChartOptions
}
