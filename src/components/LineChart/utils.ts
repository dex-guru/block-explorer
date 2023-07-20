import { LineChartDataset } from './types'

export const generateLineChartData = (
  series: LineChartDataset[],
  idxKey: string
) => {
  const objData: Record<string | number, unknown> = {}

  series.forEach((dataset) => {
    dataset.data?.forEach((el) => {
      if (!el) {
        return
      }

      objData[el[idxKey]] = {
        ...(objData[el[idxKey]] || {
          [`${idxKey}`]: el[idxKey],
        }),
        [dataset.id]: el[dataset.key || 'value'],
      }
    })
  })

  const chartData = Object.values(objData)

  return chartData
}
