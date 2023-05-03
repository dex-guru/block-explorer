import { LineChartDataset } from '../LineChart'

export type ChartProps = {
  title?: string
  data: LineChartDataset[]
  color?: string
  stroke?: number
  smooth?: boolean
  className?: string
  zeroBased?: boolean
}
