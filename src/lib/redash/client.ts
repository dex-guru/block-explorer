import isString from 'lodash/isString'
import {
  DEFAULT_DATE_RANGE,
  DYNAMIC_DATE_PREFIX,
  getDynamicDateRangePeriod,
} from '../dates'
import { getLogger } from '../logger'
import { TRedashDashboard, TRedashQuery, TRedashQueryResponse } from './types'

export const redashFetch = async (
  url: string,
  method: 'GET' | 'POST' = 'GET',
  body: unknown = null
) => {
  const logger = getLogger('redashClient')

  const apiUrl =
    typeof window !== 'undefined'
      ? '/api/redash'
      : `${process.env.NEXT_PUBLIC_REDASH_URL || ''}/api`

  const requestUrl = `${apiUrl}${url}`
  const requestBody = body ? JSON.stringify(body) : undefined
  const requestAuth = process.env.NEXT_PUBLIC_REDASH_API_KEY || ''

  try {
    const response = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: requestAuth,
      },
      body: method === 'POST' ? requestBody : undefined,
    })

    if (response.ok) {
      try {
        const data = await response.json()
        return data
      } catch (e) {
        return { message: e }
      }
    } else {
      return {
        code: response.status,
        message: response.statusText,
      }
    }
  } catch (e) {
    logger.error(e, 'redash client error')
    throw e
  }
}

export const getRedashDashboardsAll = (): Promise<{
  count: number
  page: number
  page_size: number
  results: TRedashDashboard[]
}> => {
  return redashFetch('/dashboards')
}

export const getRedashDashboardsByTag = (
  tag: string
): Promise<{
  count: number
  page: number
  page_size: number
  results: TRedashDashboard[]
}> => {
  return redashFetch(`/dashboards?tags=${tag}`)
}

export const getRedashDashboard = (
  id: string | number
): Promise<TRedashDashboard> => {
  return redashFetch(`/dashboards/${id}${isString(id) ? '?legacy=true' : ''}`)
}

export const getRedashQueriesAll = (): Promise<{
  count: number
  page: number
  page_size: number
  results: TRedashQuery[]
}> => {
  return redashFetch('/queries')
}

export const getRedashQuery = (id: number): Promise<TRedashQuery> => {
  return redashFetch(`/queries/${id}`)
}

export const getRedashQueryResponse = (
  id: number,
  parameters?: unknown
): Promise<TRedashQueryResponse> => {
  return redashFetch(`/queries/${id}/results`, 'POST', {
    parameters: parameters || {},
  })
}

export const generateRedashDashboardParams = (
  dashboard: TRedashDashboard,
  globalParams?: Record<string, unknown>
): Record<string, unknown> => {
  const params: Array<Record<string, unknown>> = []

  dashboard?.widgets?.forEach((widget) => {
    if (!widget?.visualization?.query?.options?.parameters) {
      return
    }

    params.push(
      generateRedashQueryParams(widget?.visualization?.query, globalParams)
    )
  })

  const resultParams: Record<string, unknown> = {}

  params.forEach((param) => {
    Object.entries(param).forEach(([key, value]) => {
      resultParams[key] = value
    })
  })

  return resultParams
}

export const generateRedashQueryParams = (
  query: TRedashQuery,
  globalParams?: Record<string, unknown>
): Record<string, unknown> => {
  const {
    options: { parameters: queryParameters },
  } = query

  const params =
    queryParameters?.map((param) => {
      if (globalParams && globalParams[param.name]) {
        return [param.name, globalParams[param.name]]
      }

      if (param.type === 'date-range') {
        return [
          param.name,
          getDynamicDateRangePeriod(
            `${DYNAMIC_DATE_PREFIX}${DEFAULT_DATE_RANGE}`
          ),
        ]
      }

      return [param.name, param.value]
    }) || []

  return Object.fromEntries(params)
}

export const getRedashQueriesResponse = async (
  queries: TRedashQuery[],
  globalParams?: Record<string, unknown>
) => {
  if (!queries?.length) {
    return []
  }

  const queriesData: Record<number, TRedashQueryResponse> = {}

  await Promise.all(
    queries.map(async (query) => {
      if (!query?.id) {
        return
      }

      const params = generateRedashQueryParams(query, globalParams)

      queriesData[query.id] = await getRedashQueryResponse(query.id, params)
    })
  )

  return queriesData
}

export const getRadashDashboardWithResults = async (
  id: string | number,
  params?: Record<string, unknown>
) => {
  const dashboard = await getRedashDashboard(id)
  const queryIds = dashboard?.widgets?.map(
    (widget) => widget?.visualization?.query
  )
  const queries = await getRedashQueriesResponse(queryIds || [], params)
  return {
    dashboard,
    queries,
  }
}

export const getRedashJob = (id: string): Promise<TRedashQueryResponse> => {
  return redashFetch(`/jobs/${id}`)
}
