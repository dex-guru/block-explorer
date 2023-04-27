import { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import clsx from 'clsx'
import Heading from '../Heading'
import { ChartCoord, ChartProps } from './types'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from './Chart.module.scss'

const calcLine = (
  pointA: ChartCoord,
  pointB: ChartCoord
): { length: number; angle: number } => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  }
}

const calcKeyPoint = (
  current: ChartCoord,
  previous: ChartCoord,
  next: ChartCoord,
  reverse?: boolean
): ChartCoord => {
  const cur = current
  const prev = previous ? previous : cur
  const nxt = next ? next : cur
  const smoothing = 0.2
  const o = calcLine(prev, nxt)
  const rev = reverse ? Math.PI : 0

  const x = cur[0] + Math.cos(o.angle + rev) * o.length * smoothing
  const y = cur[1] + Math.sin(o.angle + rev) * o.length * smoothing

  return [x, y]
}

const renderPath = (points: number[], smooth?: boolean): string => {
  const mappedPoints: ChartCoord[] = points.map((val, idx) => [idx, val])

  let path = `${mappedPoints}`

  if (smooth) {
    path = mappedPoints.reduce((accumulate, val, idx, arr) => {
      if (idx > 0) {
        const cs = calcKeyPoint(arr[idx - 1], arr[idx - 2], val)
        const ce = calcKeyPoint(val, arr[idx - 1], arr[idx + 1], true)
        return `${accumulate} C ${cs[0]},${cs[1]} ${ce[0]},${ce[1]} ${val[0]},${val[1]}`
      } else {
        return ''
      }
    }, '')
  }

  return `M -1,${points[0] || 0} ${path} H ${points.length} V 200 H -1 Z`
}

const Chart: FC<ChartProps> = ({
  title,
  data,
  color = 'red',
  stroke = 2,
  smooth = true,
  zeroBased,
  className,
}) => {
  if (!data?.length) {
    return null
  }

  const labels = data.map((el) => el[0])
  const values = data.map((el) => el[1])

  const diff = zeroBased ? 0 : Math.min(...values) || 0
  const max = (Math.max(...values) || 1) - diff

  const percentsOfMax: Array<number> = values.map(
    // creating path points with percentage value as Y
    (item: number) => ((max - item + diff) / max) * 100
  )

  const pathDraw = renderPath(percentsOfMax, smooth)

  // svg template with values.length as width and 100 as height for 100% in viewBox
  // no width and height set, resized by styles
  // using preserveAspectRatio and vectorEffect for correct svg scaling without squeezed and smashed
  return (
    <div className={clsx(styles.container, className)}>
      {Boolean(title) && (
        <div className={styles.header}>
          <Heading size="xs" caption={title} className={styles.title} />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.values}>
          <div className={styles.min}>
            {financialFormatLowValueHighPrecision(Math.min(...values))}
          </div>
          <div className={styles.max}>
            {financialFormatLowValueHighPrecision(Math.max(...values))}
          </div>
        </div>
        <div className={styles.chart}>
          <svg
            preserveAspectRatio="none meet"
            viewBox={`0 -10 ${data.length - 1} 120`}
            className={styles.canvas}
            width="100"
            height="100"
          >
            <path
              stroke={color}
              strokeWidth={stroke}
              fill="none"
              d={pathDraw}
              vectorEffect="non-scaling-stroke"
            />

            {percentsOfMax.map((point, index) => {
              return (
                <rect
                  key={index}
                  x={index - 0.5}
                  y={point - 10}
                  width="1"
                  fill="transparent"
                  height={100 - point + 20}
                  data-tooltip-id="app-tooltip"
                  data-tooltip-html={renderToStaticMarkup(
                    <div className="text">
                      <Heading size="xs" caption={labels[index]} />
                      <div className="value">
                        {financialFormatLowValueHighPrecision(values[index])}
                      </div>
                    </div>
                  )}
                />
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Chart
