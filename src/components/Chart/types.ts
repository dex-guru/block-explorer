export type ChartCoord = [number, number]
export type ChartData = [string, number][]
export type ChartProps = {
  title?: string
  data: ChartData
  color?: string
  stroke?: number
  smooth?: boolean
  className?: string
  zeroBased?: boolean
}
