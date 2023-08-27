import { CSSProperties, FC } from 'react'
import clsx from 'clsx'
import { HeatmapChartProps } from './types'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from './HeatmapChart.module.scss'

const HeatmapChart: FC<HeatmapChartProps> = ({
  data,
  keys,
  className,
  tooltipFormat,
  tickXFormatter,
  tickYFormatter,
}) => {
  if (!data) {
    return null
  }

  const tableRows: Record<string, Record<string, number>> = {}
  let min: number | undefined, max: number | undefined

  data.map((row) => {
    const keyX = tickXFormatter
      ? tickXFormatter(`${row[keys.x]}`)
      : `${row[keys.x]}`
    const keyY = tickYFormatter
      ? tickYFormatter(`${row[keys.y]}`)
      : `${row[keys.y]}`

    if (!tableRows[keyY]) {
      tableRows[keyY] = {}
    }

    const numberValue = Number(row[keys.val])

    if (min === undefined) {
      min = numberValue
    } else {
      min = Math.min(min, Number(row[keys.val]))
    }

    if (max === undefined) {
      max = numberValue
    } else {
      max = Math.max(max, Number(row[keys.val]))
    }

    tableRows[keyY][keyX] = numberValue
  })

  const rangeMin = min || 0
  const rangeMax = max || 0
  const rangeCap = rangeMax - rangeMin

  const renderRows = () => {
    const tableRowsArr = Object.entries(tableRows).sort(
      ([a], [b]) => Number(a) - Number(b)
    )

    const content = tableRowsArr.map(([yVal, row]) => {
      return (
        <tr key={yVal} className={styles.row}>
          <th className={styles.header}>{yVal}</th>
          {Object.entries(row).map(([xVal, value]) => {
            const percent = !rangeCap ? 0 : (value - rangeMin) / rangeCap
            const displayValue = tooltipFormat
              ? tooltipFormat({ x: xVal, y: yVal, value })
              : financialFormatLowValueHighPrecision(value)

            return (
              <td
                className={styles.cell}
                key={`${yVal}-${xVal}`}
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`${displayValue}`}
                style={{ '--percent': percent } as CSSProperties}
              />
            )
          })}
        </tr>
      )
    })

    const footer = (
      <tr className={styles.row}>
        <th className={styles.header} />
        {Object.entries(tableRowsArr[0][1]).map(([xVal]) => {
          return (
            <td className={styles.header} key={`footer-${xVal}`}>
              {xVal}
            </td>
          )
        })}
      </tr>
    )

    return (
      <>
        {content}
        {footer}
      </>
    )
  }

  return (
    <div className={clsx(styles.container, className)}>
      <table className={styles.table}>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  )
}

export default HeatmapChart
