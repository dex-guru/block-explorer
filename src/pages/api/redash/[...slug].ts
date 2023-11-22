import type { NextApiRequest, NextApiResponse } from 'next'
import { redashFetch } from '@/lib/redash/client'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestUrl = `/${req.url?.split('/').slice(3).join('/')}`
  const requestMethod = req.method === 'POST' ? 'POST' : 'GET'
  const requestBody = req.method === 'POST' && req.body ? req.body : undefined

  const data = await redashFetch(requestUrl, requestMethod, requestBody)

  if (data) {
    res.status(200).json(data)
    return
  }

  res.status(404).json({ statusCode: 404, message: `wrong response for ${requestUrl}` })
}

export default handler
