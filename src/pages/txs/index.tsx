import { Suspense, lazy } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  ChainConfigModel,
  ChainStatsModel,
  TransactionStatsModel,
} from '@/__generated__/resolvers-types'
import { Delta, DetailsView, Page, Summary, TabPanel } from '@/components'
import { LoadingCard } from '@/components/Loading'
import { Tab } from '@/components/Tabs'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_TRANSACTIONS_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import {
  financialFormatLowValueHighPrecision,
  getNormalizedValue,
} from '@/lib/utils'

const TxsDataTable = lazy(() => import('../../components/Tables/TxsDataTable/'))
const Erc20DataTable = lazy(
  () => import('../../components/Tables/Erc20DataTable/')
)
const NftDataTable = lazy(() => import('../../components/Tables/NftDataTable'))

interface ITxsProps {
  transactionStats: TransactionStatsModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  block?: number
}

const Txs: NextPage<ITxsProps> = ({ block, ...props }) => {
  const router = useRouter()
  const { tab } = router.query

  const currentTab = Array.isArray(tab) ? tab[0] : tab || ''

  const pathname = router.asPath.split('?')[0]

  const blockQuery = block ? { block: block } : undefined

  const tabs: Tab<string>[] = [
    {
      title: 'Transactions',
      value: '',
      to: { pathname, query: { ...blockQuery } },
      content: (
        <Suspense fallback={<LoadingCard />}>
          <TxsDataTable block={block} />
        </Suspense>
      ),
    },
  ]

  if (!block) {
    tabs.push(
      {
        title: 'ERC-20 Token TXns',
        value: 'tokentxns',
        to: { pathname, query: { tab: 'tokentxns' } },
        content: (
          <Suspense fallback={<LoadingCard />}>
            <Erc20DataTable chainConfig={props.chainConfig} />
          </Suspense>
        ),
      },
      {
        title: 'NFT Token TXns',
        value: 'nfttxns',
        to: { pathname, query: { tab: 'nfttxns' } },
        content: (
          <Suspense fallback={<LoadingCard />}>
            <NftDataTable />
          </Suspense>
        ),
      }
    )
  }

  const pageTitle = block
    ? `Transactions for block ${block?.toString()}`
    : 'Transactions'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore recently created transactions on ${props.chainConfig.name} ${props.chainConfig.chain}`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        <DetailsView
          title={block ? 'Transactions for block' : 'Transactions'}
          address={block?.toString()}
        >
          {!block && (
            <Summary
              stats={[
                {
                  title: 'Transactions Count',
                  value: financialFormatLowValueHighPrecision(
                    props.chainStats?.transactionsCount || 0
                  ),
                },
                {
                  title: 'Transactions per Second',
                  value: financialFormatLowValueHighPrecision(
                    props.chainStats?.transactionsPerSecond || 0,
                    { decimals: 2 }
                  ),
                },
                {
                  title: 'Transactions, 24h',
                  value: (
                    <>
                      {financialFormatLowValueHighPrecision(
                        props.transactionStats?.transactions24H
                      )}{' '}
                      <Delta
                        value={
                          props.transactionStats?.transactionsDelta24H * 100
                        }
                      />
                    </>
                  ),
                },
                {
                  title: 'Network Transactions Fee, 24h',
                  value: (
                    <>
                      {getNormalizedValue(
                        props.transactionStats?.networkTransactionsFee24H
                      )}{' '}
                      <Delta
                        value={
                          props.transactionStats
                            ?.networkTransactionsFeeDelta24H * 100
                        }
                      />
                    </>
                  ),
                },
              ]}
            />
          )}

          <TabPanel value={currentTab} tabs={tabs} />
        </DetailsView>
      </Page>
    </>
  )
}

export default Txs

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('txs')
  try {
    const apolloClient = initializeApollo({ ctx })

    const blocks = ctx.query.block as string
    const block = blocks && blocks[0] ? parseInt(blocks) : null

    const { data, error } = await apolloClient.query({
      query: GET_TRANSACTIONS_STATS,
      variables: { blockNumber: block },
    })
    error
      ? logger.error(error, 'Error getting GET_TRANSACTIONS_STATS info')
      : logger.info({ msg: 'Got GET_TRANSACTIONS_STATS info', data })

    return addApolloState(apolloClient, {
      props: {
        ...data,
        block,
      },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
