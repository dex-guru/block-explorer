export type LineChartSeries = {
  id: string
  color?: string
  yAxis?: 'left' | 'right'
  className?: string
}

export type LineChartOptions = {
  grid?: {
    horizontal?: boolean
    vertical?: boolean
  }
  axis?: {
    y?: { tickFormatter?: (value: number) => string }
    x?: { tickFormatter?: (value: number) => string }
  }
}

export type LineChartProps = {
  data: unknown[]
  series: LineChartSeries[]
  className?: string
  options?: LineChartOptions
}
