'use client'

import { FC, Fragment, ReactNode } from 'react'

import clsx from 'clsx'
import {
  Area,
  Bar,
  Brush,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
} from 'recharts'
import { CurveType } from 'recharts/types/shape/Curve'
import uniqolor from 'uniqolor'

import Message from '@/components/Message'
import { formatAutoDetect } from '@/lib/utils'

import styles from './DashboardWidgetChart.module.scss'

export type ChartSeries = {
  type?: string
  key: string
  name?: string
  curveType?: CurveType
  color?: string
  fill?: string
  stroke?: string
  formatter?: (value: any) => string
  yAxis?: YAxisProps
  icon?: ReactNode
  prefix?: string
  suffix?: string
  stackId?: string
  isInZoom?: boolean
}

export type ChartData = Record<string, unknown>

type ChartOptions = {
  tooltip?: {
    titleFormatter?: (value: any) => string
  }
  axis?: {
    y?: YAxisProps
    x?: XAxisProps
  }
  layout?: 'vertical' | 'horizontal' | 'centric' | 'radial'
  zoom?: boolean
  isAnimated?: boolean
}

type ChartProps = {
  className?: string
  data?: ChartData[]
  series?: ChartSeries | ChartSeries[]
  options?: ChartOptions
  isLoading?: boolean
  isZoom?: boolean
}

const tickFormatter = (value: string): string =>
  formatAutoDetect(value, { number: { highPrecession: false } })

export const DashboardWidgetChartRenderer: FC<ChartProps> = ({
  data,
  series,
  options,
  className,
  isLoading,
  isZoom = true,
}) => {
  const seriesArr = series ? (Array.isArray(series) ? series : [series]) : []

  const isEmptyBrush = !isZoom || !seriesArr.find((set) => set.isInZoom)

  const yAxises = seriesArr.reduce<YAxisProps[]>((acc, curr) => {
    if (acc.find((item) => item.id === curr.yAxis?.id)) {
      return acc
    }

    acc.push({
      ...curr.yAxis,
      id: curr.yAxis?.id || '',
      orientation: curr.yAxis?.orientation || 'left',
      type: curr.yAxis?.type || 'number',
      tickFormatter: curr.yAxis?.tickFormatter,
    })

    return acc
  }, [])

  const isScatterChart = seriesArr.length === 1 && seriesArr[0].type === 'scatter'

  const TypedChart = isScatterChart ? ScatterChart : ComposedChart

  const tooltipFormatter = (
    value: number | string | Array<number | string>,
    name: number | string
  ) => {
    const valueArr = Array.isArray(value) ? value : [value]
    return [valueArr.map((val) => tickFormatter(`${val}`)).join(', '), tickFormatter(`${name}`)]
  }

  return (
    <div className={clsx(styles.container, className)}>
      {isLoading && <Message type="info" text="Loading data..." />}

      {!!series && !!data && (
        <ResponsiveContainer className={styles.chart}>
          <TypedChart
            data={data}
            margin={{ left: 0, right: 15, top: 0, bottom: 0 }}
            layout={options?.layout || 'horizontal'}>
            <XAxis
              fontFamily="inherit"
              fontSize={10}
              height={24}
              tickLine={false}
              axisLine={false}
              allowDuplicatedCategory={false}
              {...options?.axis?.x}
              type={options?.axis?.x?.type || 'category'}
            />

            {yAxises.map((yAxis) => {
              return (
                <YAxis
                  key={yAxis.id}
                  fontFamily="inherit"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDuplicatedCategory={false}
                  {...options?.axis?.y}
                  type={yAxis.type}
                  yAxisId={yAxis.id}
                  tickFormatter={yAxis.tickFormatter}
                  orientation={yAxis.orientation}
                  {...yAxis}
                />
              )
            })}

            {seriesRender(seriesArr, false)}

            <Tooltip
              wrapperClassName={styles.tooltip}
              labelClassName={styles.tooltipLabel}
              separator=""
              filterNull
              formatter={tooltipFormatter}
              labelFormatter={tickFormatter}
            />

            {isZoom && !isScatterChart && (
              <Brush
                travellerWidth={8}
                traveller={<CommonChartTraveller />}
                fontFamily="inherit"
                fontSize={10}
                height={isEmptyBrush ? 24 : 48}
                dataKey={options?.axis?.x?.dataKey}
                type={options?.axis?.x?.type}
                className={styles.zoom}
                tickFormatter={options?.axis?.x?.tickFormatter}>
                {!isEmptyBrush ? (
                  <ComposedChart data={data} layout={options?.layout || 'horizontal'}>
                    {seriesRender(seriesArr, true)}
                  </ComposedChart>
                ) : (
                  <></>
                )}
              </Brush>
            )}
          </TypedChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

const CommonChartTraveller: FC<{
  x?: number
  y?: number
  width?: number
  height?: number
}> = ({ x = 0, y = 0, width = 8, height = 16 }) => {
  const rx = width / 2
  return (
    <>
      <g stroke="var(--color-bg-6)" fill="var(--color-bg-6)">
        <circle cx={x + rx} cy={y + rx} r={rx} />
        <circle cx={x + rx} cy={y + height - rx} r={rx} />

        <rect x={x} width={width} y={y + rx} height={height - width} />

        <rect x={x} width={rx} y={y} height={height} className="start" />
        <rect x={x + rx} width={rx} y={y} height={height} className="end" />
      </g>

      <rect
        width="2"
        x={x + rx - 1}
        y={y + height / 4}
        height={height / 2}
        fill="var(--color-bg)"
        rx="1"
      />
    </>
  )
}

const seriesRender = (series: ChartSeries[], isInBrush?: boolean) => {
  return (
    <>
      {series.map((set) => {
        if (isInBrush && !set.isInZoom) {
          return null
        }

        const type = set.type || 'area'
        const key = `${type}-${set.key}`

        const color = set.color ?? uniqolor(key).color

        const commonProps = {
          dataKey: set.key,
          fill: set.fill ?? color,
          stroke: set.stroke ?? color,
          strokeWidth: 2,
          name: set.name,
          stackId: set?.stackId,
          yAxisId: set.yAxis?.id,
        }

        switch (type) {
          case 'scatter': {
            return <Scatter key={key} {...commonProps} strokeWidth={0} />
          }

          case 'area': {
            const fill = set.fill ?? set.color

            return (
              <Fragment key={key}>
                {!!fill && (
                  <defs>
                    <linearGradient id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={fill} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={fill} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                )}
                <Area
                  type={set.curveType || 'monotone'}
                  {...commonProps}
                  fill={fill ? `url(#fill-${key})` : 'transparent'}
                />
              </Fragment>
            )
          }

          case 'column':
          case 'bar': {
            const fill = set.fill ?? set.color

            return <Bar key={key} {...commonProps} fill={fill} />
          }

          default: {
            return (
              <Line key={key} type={set.curveType || 'monotone'} dot={false} {...commonProps} />
            )
          }
        }
      })}
    </>
  )
}
