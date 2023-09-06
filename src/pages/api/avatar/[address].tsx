import { renderToStaticMarkup } from 'react-dom/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { isAddress } from 'viem'
import { JazzIcon, jsNumberForAddress } from '@/components/Avatar'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query

  if (!isAddress(`${address}`)) {
    res.status(404).json({ statusCode: 404, message: 'not an address' })
    return
  }

  const svg = renderToStaticMarkup(
    <JazzIcon size={32} seed={jsNumberForAddress(`${address}`)} />
  )

  res.setHeader('Content-Type', 'image/svg+xml').send(svg)
}

export default handler
