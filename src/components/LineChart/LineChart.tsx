import { FC, useState } from 'react'
import clsx from 'clsx'
import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  DomainTuple,
} from 'victory'
import { LineChartProps } from './types'
import styles from './LineChart.module.scss'

type ZoomDomain = { x: DomainTuple; y: DomainTuple }

const LineChart: FC<LineChartProps> = ({ data, className }) => {
  const [zoom, setZoom] = useState<ZoomDomain>()

  const handleZoom = (domain: ZoomDomain) => {
    setZoom(domain)
  }

  return (
    <VictoryChart
      width={550}
      height={300}
      scale={{ x: 'time' }}
      containerComponent={
        <VictoryZoomContainer
          responsive={true}
          zoomDimension="x"
          zoomDomain={zoom}
          onZoomDomainChange={handleZoom}
          className={clsx(styles.cotainer, className)}
        />
      }
    >
      {data.map((dataset) => {
        return (
          <VictoryLine
            key={dataset.id}
            interpolation="monotoneX"
            style={{
              data: { stroke: dataset.color },
            }}
            data={[
              { x: new Date(1982, 1, 1), y: 125 },
              { x: new Date(1987, 1, 1), y: 257 },
              { x: new Date(1993, 1, 1), y: 345 },
              { x: new Date(1997, 1, 1), y: 515 },
              { x: new Date(2001, 1, 1), y: 132 },
              { x: new Date(2005, 1, 1), y: 305 },
              { x: new Date(2011, 1, 1), y: 270 },
              { x: new Date(2015, 1, 1), y: 470 },
            ]}
          />
        )
      })}
    </VictoryChart>
  )
}

export default LineChart
