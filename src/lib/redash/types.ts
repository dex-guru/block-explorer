export type TRedashWidgetParam = {
  name: string
  type: string
  mapTo: string
  value: null
  title: string
}

export type TRedashWidgetOptions = {
  isHidden: boolean
  parameterMappings: Record<string, TRedashWidgetParam>
  text: string
  position: {
    autoHeight: boolean
    sizeX: number
    sizeY: number
    minSizeX: number
    maxSizeX: number
    minSizeY: number
    maxSizeY: number
    col: number
    row: number
  }
}

export type TRedashQueryParam = {
  title: string
  name: string
  type: string
  value: string | Record<string, string>
}

export type TRedashQuery = {
  id: number
  name: string
  description: string
  options: {
    parameters?: TRedashQueryParam[]
  }
}

type TRedashTableColumn = {
  visible?: boolean
  order?: number
  title?: string
  name: string
  type: 'integer' | 'string'
}

export type TRedashVisualizationOptions = unknown & {
  globalSeriesType?: string
  columnMapping?: Record<string, string>
  counterLabel?: string
  counterColName?: string
  rowNumber?: 1
  series?: {
    stacking?: boolean
  }
  seriesOptions?: Record<string, { name?: string; type?: string; color?: string; yAxis: number }>
  legend?: {
    enabled?: boolean
  }
  swappedAxes?: boolean
  columns?: TRedashTableColumn[]
  stringSuffix?: string
  yAxis: { type: string; opposite?: boolean }[]
  xAxis: { type: string }
}

export type TRedashVisualization = {
  type: string
  name: string
  description: string
  query: TRedashQuery
  options: TRedashVisualizationOptions
}

export type TRedashWidget = {
  id: number
  options: TRedashWidgetOptions
  visualization: TRedashVisualization
  text: string
}

export type TRedashQueryResultData = {
  columns: Array<{
    name: string
    friendly_name: string
    type: string
  }>
  rows: Array<Record<string, number | string>>
}

export type TRedashQueryResult = {
  data: TRedashQueryResultData
  retrieved_at: string
  id: number
}

export type TRedashJob = {
  id: string
  status: number
  error: string
  result: null
  query_result_id: string | number | null
}

export type TRedashQueryResponse = {
  query_result?: TRedashQueryResult
  job?: TRedashJob
}

export type TRedashDashboard = {
  id: number
  name: string
  slug: string
  widgets?: TRedashWidget[]
  is_draft: boolean
  is_archived: boolean
  public_url: string
  tags: string[]
  text: string
  visualization_types?: Array<{
    [type: string]: {
      sizeX: number
      sizeY: number
      col: number
      row: number
      globalSeriesType: string
    }
  }>

  user: {
    id: number
    name: string
    email: string
    profile_image_url: string
  }

  updated_at: string
  created_at: string
}
