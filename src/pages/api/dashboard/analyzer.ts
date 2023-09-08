import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const {
    dashboard_slug,
    parameters = '',
    selected_prompt = '',
  } = JSON.parse(req.body || {})

  if (!dashboard_slug || !parameters) {
    res.status(404).send({ message: 'No enough parameters provided' })
    return
  }

  const requestParameters = JSON.stringify({
    dashboard_slug,
    parameters: parameters,
    selected_prompt,
    prompt_suffix: '',
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
          session: '19359a61ae2446b51b549167b014da2fcf265768',
        },
        body: requestParameters,
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
