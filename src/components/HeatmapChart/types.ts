export type HeatmapChartEntry = Record<string, string | number>

export type HeatmapChartData = HeatmapChartEntry[]

export type HeatmapChartProps = {
  data?: HeatmapChartData
  className?: string
  keys: { x: string; y: string; val: string }
  tickXFormatter?: (value: string) => string
  tickYFormatter?: (value: string) => string
  tooltipFormat?: (props: { x: string; y: string; value: string | number }) => string
}
