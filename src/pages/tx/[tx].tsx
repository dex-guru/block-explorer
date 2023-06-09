import { Suspense, lazy } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { usePathname, useSearchParams } from 'next/navigation'
import { isHexString } from '@ethersproject/bytes'
import {
  ChainConfigModel,
  ChainStatsModel,
  Erc20EventModel,
  Erc721TransferModel,
  LogModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Empty, Page, TabPanel } from '@/components'
import DetailsView from '@/components/DetailsView/DetailsView'
import IconEmpty from '@/images/icons/no-flash.svg'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_TRANSACTIONS_BY_HASH } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

const TxOverview = lazy(() => import('../../components/TabContent/TxOverview'))
const TxLogs = lazy(() => import('../../components/TabContent/TxLogs'))
const TxTrace = lazy(() => import('../../components/TabContent/TxTrace'))

interface ITxProps {
  data: TransactionModel
  logs: LogModel[]
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  erc20Events: Erc20EventModel[]
  nftEvents: Erc721TransferModel[]
}

const TxPage: NextPage<ITxProps> = (props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  if (!searchParams || !pathname) {
    return null
  }
  const tab = searchParams.get('tab')
  const currentTab = Array.isArray(tab) ? tab[0] : tab || ''

  const pageTitle = `Transaction ${props.data?.hash || 'not found'}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore transaction ${
            props.data?.hash || ''
          } to see what happened with token balances and smart contracts in this TX.`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        {!props.data?.hash && (
          <Empty icon={<IconEmpty />} title="No TX was found" />
        )}

        {!!props.data?.hash && (
          <DetailsView
            title="Transaction"
            address={props.data?.hash || undefined}
          >
            <TabPanel
              tabs={[
                {
                  title: 'Overview',
                  value: '',
                  to: pathname,
                  content: (
                    <Suspense>
                      <TxOverview {...props} />
                    </Suspense>
                  ),
                },
                {
                  title: `Logs (${props.data.receiptLogsCount || 0})`,
                  value: 'logs',
                  to: `${pathname}?tab=logs`,
                  content: (
                    <Suspense>
                      <TxLogs {...props} />
                    </Suspense>
                  ),
                },
                {
                  title: 'Trace',
                  value: 'trace',
                  to: `${pathname}?tab=trace`,
                  content: (
                    <Suspense>
                      <TxTrace {...props} />
                    </Suspense>
                  ),
                },
              ]}
              value={currentTab}
            />
          </DetailsView>
        )}
      </Page>
    </>
  )
}

export default TxPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('tx')
  try {
    const { tx } = ctx.query

    const apolloClient = initializeApollo({ ctx })

    if (!isHexString(tx)) {
      ctx.res.statusCode = 404

      const { data } = await apolloClient.query<{
        chainStats: ChainStatsModel
        chainConfig: ChainConfigModel
      }>({
        query: CHAIN_STATS,
      })

      return { props: data }
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
      ctx.res.statusCode = 404
    }

    return addApolloState(apolloClient, {
      props: {
        data: transactions[0],
        logs: logs || [],
        chainConfig: chainConfig,
        chainStats: chainStats,
        erc20Events: erc20Events || [],
        nftEvents: nftEvents || [],
      },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
