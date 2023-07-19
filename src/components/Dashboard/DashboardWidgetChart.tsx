import { CSSProperties, FC } from 'react'
import uniqolor from 'uniqolor'
import LineChart, { LineChartDataset } from '../LineChart'
import PieChart from '../PieChart'
import { Table } from '../Table'
import {
  DashboardWidgetQueryResult,
  DashboardWidgetVisualization,
} from './types'
import { financialFormat } from '@/lib/utils'
import styles from './DashboardWidgetChart.module.scss'

const DashboardWidgetChart: FC<{
  type: 'pie' | 'line'
  queryResult: DashboardWidgetQueryResult
  visualization: DashboardWidgetVisualization
}> = ({ type, queryResult, visualization }) => {
  // const dataSeries: LineChartDataset[] = [
  //   {
  //     id: 'holders',
  //     name: 'Holders',
  //     color: '#46a6ff',
  //     data: balancesStats?.holdersChart || [],
  //     yAxis: 'left',
  //   },
  // ]

  const columnMapping: Record<string, string[]> = { x: [], y: [] }

  Object.entries(visualization.options.columnMapping).forEach(([key, axis]) => {
    columnMapping[axis].push(key)
  })

  if (type === 'pie') {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <PieChart
            className={styles.chart}
            data={queryResult.data.rows}
            options={{
              dataKey: columnMapping.y[0],
              nameKey: columnMapping.x[0],
              formatter: (val) => financialFormat(`${val}`),
            }}
          />
        </div>

        <ul className={styles.legend}>
          {queryResult.data.rows.map((item, idx) => {
            return (
              <li
                key={idx}
                className={styles.entry}
                style={
                  {
                    '--color': uniqolor(item[columnMapping.x[0]] || '').color,
                  } as CSSProperties
                }
              >
                {item[columnMapping.x[0]]}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const entities: Record<
    string,
    { name: string; friendly_name: string; type: string }
  > = queryResult?.data?.columns?.reduce(
    (obj, curr) => ({ ...obj, [curr.name]: curr }),
    {}
  )

  console.log(queryResult?.data?.columns, entities)

  return (
    <div className={styles.chart}>{/* <LineChart data={dataSeries} /> */}</div>
  )
}

export default DashboardWidgetChart
