export type ChartCoord = [number, number]
export type ChartData = {
  label: string
  value: number
  tooltipLabel?: string
  tooltipValue?: string
}[]
export type ChartProps = {
  title?: string
  data: ChartData
  color?: string
  stroke?: number
  smooth?: boolean
  className?: string
  zeroBased?: boolean
}
