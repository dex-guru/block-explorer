import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const { dashboard_slug, parameters, chat_logs } = JSON.parse(req.body || {})

  if (!dashboard_slug || !parameters) {
    res.status(404).send({ message: 'No enough parameters provided' })
    return
  }

  const requestParameters = JSON.stringify({
    dashboard_slug,
    parameters: JSON.stringify(parameters),
    chat_logs: JSON.stringify(chat_logs),
  })

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LANGCHAIN_API_URL || ''}/prompts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        session: '19359a61ae2446b51b549167b014da2fcf265768',
      },
      body: requestParameters,
    })

    if (response.ok) {
      const data = await response.json()

      res.status(200).json({ prompts: data })
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
}

export default handler
