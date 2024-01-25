import type { NextApiRequest, NextApiResponse } from 'next'

import { initializeApollo } from '@/lib/apollo/client'
import { CHAIN_HEALTH } from '@/lib/apollo/queries'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apolloClient = initializeApollo({})

    apolloClient
      .query({
        query: CHAIN_HEALTH,
      })
      .then(({ error }) => {
        if (error) {
          res.status(500).json({ statusCode: 500, message: (error as Error).message })
        } else {
          res.status(200).json({ status: 'Healthy' })
        }
      })
      .catch((err) => res.status(500).json({ statusCode: 500, message: (err as Error).message }))
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: (err as Error).message })
  }
}

export default handler
