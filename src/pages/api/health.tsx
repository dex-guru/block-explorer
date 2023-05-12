import type { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    res.status(200).json({ status: 'Healthy' })
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: (err as Error).message })
  }
}

export default handler
