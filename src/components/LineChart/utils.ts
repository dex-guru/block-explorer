import { LineChartDataset } from './types'

type TimestampObject = { timestamp: number }

export const generateLineChartData = (series: LineChartDataset[]) => {
  const objData: Record<number, unknown> = {}

  series.forEach((dataset) => {
    dataset.data.forEach((el) => {
      objData[el.timestamp] = {
        ...(objData[el.timestamp] || {
          timestamp: el.timestamp,
          label: el.timestamp,
        }),
        [dataset.id]: el.value,
      }
    })
  })

  const chartData = Object.values(objData).sort(
    (a, b) =>
      (a as TimestampObject).timestamp - (b as TimestampObject).timestamp
  )

  return chartData
}
