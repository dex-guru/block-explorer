export type LineChartDataSeries = {
  id: string
  color: string
  data: { x: string; y: number }[]
}

export type LineChartProps = {
  data: LineChartDataSeries[]
  className?: string
}
