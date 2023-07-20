import { Props as GridProps } from 'recharts/types/cartesian/CartesianGrid'
import { Props as XAxisProps } from 'recharts/types/cartesian/XAxis'
import { Props as YAxisProps } from 'recharts/types/cartesian/YAxis'
import { CurveType } from 'recharts/types/shape/Curve'

export type CommonChartDataset = {
  id: string
  data: { [key: string]: number | string }[]
  name?: string
  color?: string
  yAxis?: 'left' | 'right'
  className?: string
  key?: string
  type?: CurveType
}

export type CommonChartOptions = {
  grid?: GridProps
  axis?: {
    y?: YAxisProps
    x?: XAxisProps
  }
  zoom?: boolean
}

export type CommonChartProps = {
  data: CommonChartDataset[]
  type?: string
  className?: string
  options: CommonChartOptions & { axis: { x: { dataKey: string } } }
}
