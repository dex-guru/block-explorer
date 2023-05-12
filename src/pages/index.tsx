/* eslint-disable */
import { useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
  CosmosTransactionModel,
  CsrStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Banner, Card, Grid, Page, Summary, Table, Value } from '@/components'
import Search from '@/components/Search'
import {
  BlockModelWithTimeDiff,
  lastBlocksColumns,
} from '@/components/Table/columns/lastBlocksColumns'
import ShortCosmosTxsTable from '@/components/Tables/ShortCosmosTxs'
import { ShortTxsTable } from '@/components/Tables/ShortTxs'
import Tabs from '@/components/Tabs'
import { CHAIN_ID } from '@/constants'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import {
  GET_BLOCKS_SHORT,
  GET_BLOCKS_TXNS_CHAIN_STATS,
} from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getBlocksWithTimeDiff,
} from '@/lib/utils'
import styles from './Pages.module.scss'

interface IndexProps {
  transactions: TransactionModel[]
  blocks: BlockModelWithTimeDiff[]
  chainStats: ChainStatsModel
  csrStats: CsrStatsModel
  chainConfig: ChainConfigModel
  cosmosTransactions: CosmosTransactionModel[]
}

const ITEMS_PER_PAGE = 10
console.log('config chain id', process.env.NEXT_PUBLIC_CHAIN_ID)

const Index: NextPage<IndexProps> = (props) => {
  const { chainStats: stats, chainConfig } = props
  const [blocks, setBlocks] = useState<BlockModelWithTimeDiff[]>(props.blocks)

  const [isCosmos, setIsCosmos] = useState(false)

  const { data: blocksUpdate, loading } = useQuery<{ blocks: BlockModel[] }>(
    GET_BLOCKS_SHORT,
    {
      variables: { first: ITEMS_PER_PAGE + 1, skip: 0, chainId: CHAIN_ID },
      pollInterval: Number(process.env.pollInterval),
    }
  )

  useEffect(() => {
    if (!loading && blocksUpdate) {
      const blocksWithTimeDiff = getBlocksWithTimeDiff(
        blocksUpdate.blocks,
        ITEMS_PER_PAGE
      )

      setBlocks(blocksWithTimeDiff)
    }
  }, [blocksUpdate, loading])

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
          suffix={
            <>
              &nbsp;
              {financialFormatLowValueHighPrecision(
                stats.transactionsPerSecond
              )}{' '}
              txs/sec
            </>
          }
        />
      ),
    },
    {
      title: 'Market Cap',
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(stats.marketCap, {
            decimals: 2,
          })}
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
            suffix={<>&nbsp;{props.chainConfig.nativeCurrency.symbol}</>}
          />
        </Link>
      ),
    },
  ]

  const pageTitle = `${chainConfig.nativeCurrency.name} Block Explorer`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
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
                title: `${
                  chainConfig.nativeCurrency.name || ''
                } Transaction History in 14 days`,
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
              getRowKey={(data) => data.number.toString()}
            />
          </Card>

          <Card
            title="Latest Transactions"
            header={
              <Tabs
                tabs={[
                  { title: 'EVM', value: 'evm' },
                  { title: 'Cosmos', value: 'cosmos' },
                ]}
                className={styles.tabsInner}
                value={isCosmos ? 'cosmos' : 'evm'}
                onChange={(value) => {
                  setIsCosmos(value === 'cosmos')
                }}
              />
            }
            actions={
              !isCosmos
                ? [
                    {
                      caption: 'View all transactions',
                      to: '/txs',
                    },
                  ]
                : []
            }
          >
            {isCosmos ? (
              <ShortCosmosTxsTable data={props.cosmosTransactions} />
            ) : (
              <ShortTxsTable
                data={props.transactions}
                chainConfig={chainConfig}
              />
            )}
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
    data: { transactions, blocks, chainStats, csrStats, chainConfig, cosmos },
  } = await apolloClient.query({
    query: GET_BLOCKS_TXNS_CHAIN_STATS,
    // per_page + 1 - last item needs for time diff
    variables: { first: ITEMS_PER_PAGE + 1, skip: 0, chainId: CHAIN_ID },
  })

  const blocksWithTimeDiff = getBlocksWithTimeDiff(blocks, ITEMS_PER_PAGE)

  return addApolloState(apolloClient, {
    props: {
      transactions,
      chainStats,
      csrStats,
      chainConfig,
      blocks: blocksWithTimeDiff,
      cosmosTransactions: cosmos.transactions,
    },
  })
}
