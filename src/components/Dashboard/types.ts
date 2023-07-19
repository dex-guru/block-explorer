export type DashboardWidgetParameters = Record<
  string,
  {
    name: string
    type: string
    mapTo: string
    value: null
    title: string
  }
>

export type DashboardWidgetOptions = {
  isHidden: boolean
  parameterMappings: DashboardWidgetParameters
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

export type DashboardWidgetVisualization = {
  type: string
  name: string
  description: string
  query: {
    id: number
    name: string
    description: string
  }
  options: unknown & {
    globalSeriesType?: string
    columnMapping: Record<string, string>
  }
}

export type DashboardWidgetData = {
  id: number
  options: DashboardWidgetOptions
  visualization: DashboardWidgetVisualization
  text: string
}

export type DashboardWidgetQueryData = {
  columns: Array<{
    name: string
    friendly_name: string
    type: string
  }>
  rows: Array<Record<string, number | string>>
}

export type DashboardWidgetQueryResult = {
  data: DashboardWidgetQueryData
  retrieved_at: string
}

export type DashboardData = {
  id: number
  name: string
  slug: string
  widgets?: DashboardWidgetData[]
  is_draft: boolean
  is_archived: boolean
  public_url: string
  tags: string[]
  text: string
}
