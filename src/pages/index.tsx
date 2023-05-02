/* eslint-disable */
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
  CsrStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Banner, Card, Grid, Page, Summary, Table, Value } from '@/components'
import Search from '@/components/Search'
import { lastTxsColumns } from '@/components/Table/columns'
import {
  BlockModelWithTimeDiff,
  lastBlocksColumns,
} from '@/components/Table/columns/lastBlocksColumns'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import {
  CHAIN_STATS,
  GET_BLOCKS_SHORT,
  TRANSACTIONS_LAST,
} from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
} from '@/lib/utils'
import styles from './Pages.module.scss'

interface IndexProps {
  transactions: TransactionModel[]
  blocks: BlockModelWithTimeDiff[]
  chainStats: ChainStatsModel
  csrStats: CsrStatsModel
  chainConfig: ChainConfigModel
}

const ITEMS_PER_PAGE = 10

const Index: NextPage<IndexProps> = (props) => {
  const { blocks, chainStats: stats, transactions } = props

  const chartData = [
    {
      id: 'txHistory',
      data: stats.transactionsCountHistory,
    },
  ]

  const statsDisplay = [
    {
      title: 'Last Block Number',
      value: financialFormatLowValueHighPrecision(stats.lastBlockNumber),
    },
    {
      title: 'Transactions',
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(stats.transactionsCount)}
          suffix={` ${financialFormatLowValueHighPrecision(
            stats.transactionsPerSecond
          )}  txs/sec`}
        />
      ),
    },
    {
      title: 'Market Cap',
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(stats.marketCap)}
          prefix="$"
        />
      ),
    },
    {
      title: 'Token Supply',
      value: financialFormatLowValueHighPrecision(stats.tokenSupply),
    },
    {
      title: 'Token Price',
      value: (
        <Value
          value={financialFormat(stats.nativeTokenPriceUsd)}
          prefix="$"
          delta={stats.nativeTokenPriceUsd24hDelta * 100}
        />
      ),
    },
    {
      title: 'Total Revenue',
      value: (
        <Link href="/csr">
          <Value
            value={financialFormatLowValueHighPrecision(
              props.csrStats.sumRevenue,
              {
                decimals: 2,
              }
            )}
            suffix={` ${props.chainConfig.nativeCurrency.symbol}`}
          />
        </Link>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Banner>
          <Search className={styles.searchMain} />
        </Banner>

        {!!stats && (
          <Summary
            stats={statsDisplay}
            charts={[
              {
                title: 'Ethereum Transaction History in 14 days',
                data: chartData,
              },
            ]}
          />
        )}

        <Grid>
          <Card
            title="Latest Blocks"
            actions={[
              {
                caption: 'View all blocks',
                to: '/blocks',
              },
            ]}
          >
            <Table
              columns={lastBlocksColumns}
              data={blocks}
              showHeader={false}
              className={styles.cardChild}
            />
          </Card>

          <Card
            title="Latest Transactions"
            actions={[
              {
                caption: 'View all transactions',
                to: '/txs',
              },
            ]}
          >
            <Table
              columns={lastTxsColumns}
              data={transactions}
              showHeader={false}
              className={styles.cardChild}
            />
          </Card>
        </Grid>
      </Page>
    </>
  )
}

export default Index

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const {
    data: { transactions },
  } = await apolloClient.query({
    query: TRANSACTIONS_LAST,
  })
  const { data: blocks } = await apolloClient.query<{ blocks: BlockModel[] }>({
    query: GET_BLOCKS_SHORT,
    // per_page + 1 - last item needs for time diff
    variables: { first: ITEMS_PER_PAGE + 1, skip: 0 },
  })

  const blocksWithTimeDiff = blocks.blocks.map((block, index, array) => {
    if (index !== ITEMS_PER_PAGE) {
      const timeDiff = block.timestamp - array[10].timestamp
      return { ...block, timeDiff }
    }
    return block
  })

  blocksWithTimeDiff.splice(ITEMS_PER_PAGE, 1)

  const {
    data: { chainStats, csrStats, chainConfig },
  } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  return addApolloState(apolloClient, {
    props: {
      transactions,
      chainStats,
      csrStats,
      chainConfig,
      blocks: blocksWithTimeDiff,
    },
  })
}
