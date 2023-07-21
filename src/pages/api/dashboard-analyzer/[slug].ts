import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query

  try {
    const response = await fetch(
      'https://langchain-stage.dexguru.biz/endpoints.dashboard_analyze_chain.sequential_chain/run',
      {
        method: 'POST',
        body: JSON.stringify({
          dashboard_slug: slug,
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
