import type { NextApiRequest, NextApiResponse } from 'next'

import { renderToStaticMarkup } from 'react-dom/server'
import { isAddress } from 'viem'

import { JazzIcon, jsNumberForAddress } from '@/components/Avatar'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { address } = req.query
    const lowerAddress = `${address}`.toLowerCase()

    if (!isAddress(lowerAddress)) {
      res.status(404).json({ statusCode: 404, message: 'not an address' })
      return
    }

    const svg = renderToStaticMarkup(<JazzIcon size={32} seed={jsNumberForAddress(lowerAddress)} />)
    res.setHeader('Cache-Control', 's-maxage=31536000')
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(svg)
  } catch (err) {
    res.send({ statusCode: 500, message: (err as Error).message })
  }
}

export default handler
