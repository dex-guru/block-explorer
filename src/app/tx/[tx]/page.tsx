import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isHexString } from '@ethersproject/bytes'
import TxPage, { ITxProps, TxEventsData } from './tx'
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
import {
  GET_ERC20_EVENTS,
  GET_TRANSACTIONS_BY_HASH,
} from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export const MAX_EVENTS_PER_PAGE = 10

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

    const { data, error: errorData } = await apolloClient.query<{
      transactions: TransactionModel[]
      logs: LogModel[]
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
      nftEvents: TxEventsData<Erc721TransferModel>
    }>({
      query: GET_TRANSACTIONS_BY_HASH,
      variables: { hash: tx, eventsCount: MAX_EVENTS_PER_PAGE },
    })

    errorData
      ? logger.error(errorData, 'Error getting GET_TRANSACTIONS_BY_HASH info')
      : logger.info({ msg: 'Got GET_TRANSACTIONS_BY_HASH info', data })

    const { transactions, logs, chainConfig, chainStats, nftEvents } = data

    if (!transactions?.length) {
      notFound()
    }

    const { data: erc20EventsData, error: erc20EventsError } =
      await apolloClient.query<{
        erc20Events: TxEventsData<Erc20EventModel>
      }>({
        query: GET_ERC20_EVENTS,
        variables: {
          hash: tx,
          eventTypes: 'transfers',
          skip: 0,
          first: MAX_EVENTS_PER_PAGE,
        },
      })

    erc20EventsError
      ? logger.error(erc20EventsError, 'Error getting GET_ERC20_EVENTS info')
      : logger.info({ msg: 'Got GET_ERC20_EVENTS transfers info', data })

    const erc20Transfers = erc20EventsData.erc20Events

    const { data: erc20ActionsData, error: erc20ActionsError } =
      await apolloClient.query<{
        erc20Events: TxEventsData<Erc20EventModel>
      }>({
        query: GET_ERC20_EVENTS,
        variables: {
          hash: tx,
          eventTypes: 'actions',
          skip: 0,
          first: MAX_EVENTS_PER_PAGE,
        },
      })

    erc20ActionsError
      ? logger.error(erc20ActionsError, 'Error getting GET_ERC20_EVENTS info')
      : logger.info({ msg: 'Got GET_ERC20_EVENTS actions info', data })

    const erc20Actions = erc20ActionsData.erc20Events

    return {
      data: transactions[0] || null,
      logs: logs || [],
      chainConfig: chainConfig,
      chainStats: chainStats,
      erc20Transfers: erc20Transfers || [],
      erc20Actions: erc20Actions || [],
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
