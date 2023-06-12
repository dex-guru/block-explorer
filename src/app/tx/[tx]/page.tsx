import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isHexString } from '@ethersproject/bytes'
import TxPage, { ITxProps } from './tx'
import {
  ChainConfigModel,
  ChainStatsModel,
  Erc20EventModel,
  Erc721TransferModel,
  LogModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { getClient } from '@/lib/apollo/apolloClient'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'
import { GET_TRANSACTIONS_BY_HASH } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { tx: string }
}): Promise<Metadata> {
  const { tx } = params
  const pageTitle = `Transaction ${tx || 'not found'}`

  const chainConfig = await getChainConfig()

  return {
    title: pageTitle,
    icons: chainConfig.icon,
    description: `Explore transaction ${
      tx || ''
    } to see what happened with token balances and smart contracts in this TX.`,
  }
}

const getProps = async (tx: string): Promise<ITxProps> => {
  const logger = getLogger('tx')
  try {
    const apolloClient = getClient()

    if (!isHexString(tx)) {
      notFound()
    }

    const { data, error } = await apolloClient.query<{
      transactions: TransactionModel[]
      logs: LogModel[]
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
      erc20Events: { data: Erc20EventModel[] }
      nftEvents: { data: Erc721TransferModel[] }
    }>({
      query: GET_TRANSACTIONS_BY_HASH,
      variables: { hash: tx },
    })

    error
      ? logger.error(error, 'Error getting GET_TRANSACTIONS_BY_HASH info')
      : logger.info({ msg: 'Got GET_TRANSACTIONS_BY_HASH info', data })

    const {
      transactions,
      logs,
      chainConfig,
      chainStats,
      erc20Events: { data: erc20Events },
      nftEvents: { data: nftEvents },
    } = data

    if (!transactions?.length) {
      notFound()
    }

    return {
      data: transactions[0],
      logs: logs || [],
      chainConfig: chainConfig,
      chainStats: chainStats,
      erc20Events: erc20Events || [],
      nftEvents: nftEvents || [],
    }
  } catch (e) {
    logger.error(e, 'getProps error on tx page')
    throw e
  }
}

export default async function Page({ params }: { params: { tx: string } }) {
  const { tx } = params
  const props = await getProps(tx)

  return <TxPage {...props} />
}
