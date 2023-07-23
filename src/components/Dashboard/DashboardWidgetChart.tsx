import { CSSProperties, FC } from 'react'
import { CommonChart, Loading, Message, PieChart } from '..'
import clsx from 'clsx'
import uniqolor from 'uniqolor'
import {
  TRedashQueryResultData,
  TRedashVisualization,
} from '@/lib/redash/types'
import { financialFormat, getShortDate } from '@/lib/utils'
import styles from './DashboardWidgetChart.module.scss'

const DashboardWidgetChart: FC<{
  type: string
  data?: TRedashQueryResultData
  visualization: TRedashVisualization
  isLoading?: boolean
}> = ({ type, data, visualization, isLoading }) => {
  const columnMapping: Record<string, string[]> = { x: [], y: [] }

  Object.entries(visualization.options.columnMapping || {}).forEach(
    ([key, axis]) => {
      columnMapping[axis].push(key)
    }
  )

  if (type === 'pie') {
    return (
      <div className={clsx(styles.container, { [styles.loading]: isLoading })}>
        {isLoading && <Loading className={styles.loader} />}

        <div className={styles.wrapper}>
          <PieChart
            className={styles.chart}
            data={data?.rows || []}
            options={{
              dataKey: columnMapping.y[0],
              nameKey: columnMapping.x[0],
              formatter: (val) => financialFormat(`${val}`),
            }}
          />
        </div>

        <ul className={styles.legend}>
          {data?.rows.map((item, idx) => {
            return (
              <li
                key={idx}
                className={styles.entry}
                style={
                  {
                    '--color': uniqolor(
                      `${item[columnMapping.x[0]] || ''}${idx}`
                    ).color,
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

  if (['line', 'area', 'column', 'bar'].includes(type)) {
    const entities: Record<
      string,
      { name: string; friendly_name: string; type: string }
    > =
      data?.columns?.reduce(
        (obj, curr) => ({ ...obj, [curr.name]: curr }),
        {}
      ) || {}

    const tickFormatter = (value: string) => {
      if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) {
        return getShortDate(new Date(value).getTime(), false)
      }

      if (Number.isFinite(value)) {
        return financialFormat(value)
      }

      return value
    }

    const dataset = columnMapping.y.map((col, idx) => {
      const entity = entities[col]

      const entityTitle = visualization.options?.seriesOptions
        ? visualization.options?.seriesOptions[entity?.name]?.name
        : entity?.friendly_name || entity?.name

      return {
        id: col,
        data: data?.rows || [],
        color: uniqolor(`${idx}-${col}`).color,
        name: entityTitle,
        key: entity?.name,
        className: `has-color ${entity?.name}`,
      }
    })

    return (
      <div className={clsx(styles.wrapper, { [styles.loading]: isLoading })}>
        {isLoading && <Loading className={styles.loader} />}

        <CommonChart
          className={styles.chart}
          type={type || 'line'}
          data={dataset}
          options={{
            zoom: true,
            axis: {
              x: {
                type: 'category',
                dataKey: columnMapping.x[0],
                axisLine: false,
                tickLine: false,
                tickFormatter: tickFormatter,
              },
              y: {
                axisLine: false,
                tickLine: false,
                tickFormatter: tickFormatter,
              },
            },
          }}
        />
      </div>
    )
  }

  return (
    <Message type="warn">
      Type &quot;{type}&quot; is not implemented yet
    </Message>
  )
}

export default DashboardWidgetChart
