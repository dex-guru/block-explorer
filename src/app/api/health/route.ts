import { NextResponse } from 'next/server'
import { getClient } from '@/lib/apollo/apolloClient'
import { CHAIN_STATS } from '@/lib/apollo/queries'

export const GET = async (): Promise<NextResponse> => {
  try {
    const apolloClient = getClient()

    return apolloClient
      .query({
        query: CHAIN_STATS,
      })
      .then(({ error }) => {
        if (error) {
          return NextResponse.json(
            { statusCode: 500, message: (error as Error).message },
            { status: 500 }
          )
        } else {
          return NextResponse.json(
            { statusCode: 200, status: 'Healthy' },
            { status: 200 }
          )
        }
      })
      .catch((err) =>
        NextResponse.json(
          { statusCode: 500, message: (err as Error).message },
          { status: 500 }
        )
      )
  } catch (err) {
    return NextResponse.json(
      { statusCode: 500, message: (err as Error).message },
      { status: 500 }
    )
  }
}
