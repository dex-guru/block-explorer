import { Props as GridProps } from 'recharts/types/cartesian/CartesianGrid'
import { Props as XAxisProps } from 'recharts/types/cartesian/XAxis'
import { Props as YAxisProps } from 'recharts/types/cartesian/YAxis'
import { CurveType } from 'recharts/types/shape/Curve'

export type LineChartDataset = {
  id: string
  data: unknown[]
  name?: string
  color?: string
  yAxis?: 'left' | 'right'
  className?: string
  key?: string
  type?: CurveType
}

export type LineChartOptions = {
  grid?: GridProps
  axis?: {
    y?: YAxisProps
    x?: XAxisProps
  }
  zoom?: boolean
}

export type LineChartProps = {
  data: LineChartDataset[]
  className?: string
  options?: LineChartOptions & { axis: { x: { dataKey: string } } }
}
