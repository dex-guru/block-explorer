import type { NextApiRequest, NextApiResponse } from 'next'
import {
  generateRedashQueryParams,
  getRedashDashboard,
} from '@/lib/redash/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const { dashboard_slug, parameters } = JSON.parse(req.body || {})

  const dashboard = await getRedashDashboard(slug as string)

  const paramsResult: Array<Record<string, unknown>> = []

  dashboard?.widgets?.forEach((widget) => {
    if (!widget?.visualization?.query?.options?.parameters) {
      return
    }

    paramsResult.push(
      generateRedashQueryParams(widget?.visualization?.query, {
        chain_id: process.env.NEXT_PUBLIC_CHAIN_ID || 7700,
      })
    )
  })

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_LANGCHAIN_API_URL || ''
      }/endpoints.dashboard_analyze_chain.sequential_chain/run`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          dashboard_slug,
          parameters: JSON.stringify(parameters) || '',
          prompt_suffix: '',
          selected_prompt: '',
        }),
      }
    )

    if (response.ok) {
      const data = await response.json()

      res.status(200).json(data)
      return
    }

    res.status(response.status).json({
      statusCode: response.status,
      message: response.statusText,
      body: await response.text(),
    })

    return
  } catch (e) {
    res.status(500).json({
      statusCode: 500,
      message: e,
    })

    return
  }

  res.status(500).json({
    statusCode: 500,
    message: 'common analyzer error',
  })
}

export default handler
