export type PieChartProps = {
  data: Record<string, number | string>[]
  className?: string
  options: {
    nameKey: string
    dataKey: string
    formatter: (value: unknown, idx: number) => string
  }
}
