export type LineChartSeries = {
  id: string
  color: string
}

export type LineChartProps = {
  data: unknown[]
  series: LineChartSeries[]
  className?: string
}
