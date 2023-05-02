export type LineChartSeries = {
  id: string
  color?: string
  yAxis?: 'left' | 'right'
}

export type LineChartProps = {
  data: unknown[]
  series: LineChartSeries[]
  className?: string
}
