/* eslint-disable */
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import {
  BlockModel,
  ChainStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import {
  Address,
  Banner,
  Card,
  Delta,
  Heading,
  Label,
  Page,
  Summary,
  Tile,
  TimeAgo,
} from '@/components'
import { ChartData } from '@/components/Chart'
import Search from '@/components/Search'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import {
  BLOCKS_LAST,
  CHAIN_STATS,
  TRANSACTIONS_LAST,
} from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'

interface IndexProps {
  transactions: TransactionModel[]
  blocks: BlockModel[]
  chainStats: ChainStatsModel
}

const Index: NextPage<IndexProps> = (props) => {
  const { blocks, chainStats: stats, transactions } = props

  const chartData = stats.transactionsCountHistory.map(
    ({ timestamp, value }) => {
      const date = new Date(timestamp * 1000)
      return [date.toUTCString(), value]
    }
  )

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
          <Heading size="lg">Dex.guru Explorer</Heading>
          <Search />
        </Banner>

        {!!stats && (
          <Summary
            stats={[
              {
                title: 'Last Block Number',
                value: financialFormatLowValueHighPrecision(
                  stats.lastBlockNumber
                ),
              },
              {
                title: 'Transactions',
                value: (
                  <>
                    {financialFormatLowValueHighPrecision(
                      stats.transactionsCount
                    )}{' '}
                    (
                    {financialFormatLowValueHighPrecision(
                      stats.transactionsPerSecond
                    )}
                    txs/sec)
                  </>
                ),
              },
              {
                title: 'Market Cap',
                value: financialFormatLowValueHighPrecision(stats.marketCap),
              },
              {
                title: 'Token Supply',
                value: financialFormatLowValueHighPrecision(stats.tokenSupply),
              },
              {
                title: 'Token Price',
                value: (
                  <>
                    {financialFormatLowValueHighPrecision(
                      stats.nativeTokenPriceUsd
                    )}{' '}
                    <Delta value={stats.nativeTokenPriceUsd24hDelta * 100} />
                  </>
                ),
              },
            ]}
            charts={[
              {
                title: 'Ethereum Transaction History in 14 days',
                data: chartData as ChartData,
                color: '#9488F0',
              },
            ]}
          />
        )}

        <Card
          isHalf
          title="Latest Blocks"
          actions={[
            {
              caption: 'View all blocks',
              to: '/blocks',
            },
          ]}
        >
          <table className="data-table">
            <tbody>
              {blocks?.map((block) => {
                return (
                  <tr className="data-table__trow" key={block.hash}>
                    <th className="data-table__tcell data-table__tcell--asset">
                      <Tile
                        letters="Bk"
                        title={
                          <Address address={`${block.number}`} type="block" />
                        }
                        postfix={<TimeAgo timestamp={block.timestamp} />}
                      />
                    </th>
                    <td className="data-table__tcell data-table__tcell--data">
                      <div className="data-table__data">
                        <div className="value">
                          Miner <Address address={block.miner} type="account" />
                        </div>
                        <small className="value">
                          <Link href="/">{block.transactionCount} txns</Link> in
                          😢 sec
                        </small>
                      </div>
                    </td>
                    <td className="data-table__tcell data-table__tcell--label">
                      <Label title="😢" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>

        <Card
          isHalf
          title="Latest Transactions"
          actions={[
            {
              caption: 'View all transactions',
              to: '/txs',
            },
          ]}
        >
          <table className="data-table">
            <tbody>
              {transactions?.map((tx) => {
                return (
                  <tr className="data-table__trow" key={tx.hash}>
                    <th className="data-table__tcell data-table__tcell--asset">
                      <Tile
                        letters="Tx"
                        avatarType="rounded"
                        title={<Address address={tx.hash} type="tx" />}
                        postfix={<TimeAgo timestamp={tx.blockTimestamp} />}
                      />
                    </th>
                    <td className="data-table__tcell data-table__tcell--data">
                      <div className="data-table__data">
                        <div className="value">
                          From{' '}
                          <Address address={tx.fromAddress} type="account" />
                        </div>
                        {!!tx.toAddress && (
                          <div className="value">
                            To <Address address={tx.toAddress} type="account" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="data-table__tcell data-table__tcell--label">
                      <Label title={(tx.value / Math.pow(10, 18)).toString()} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </Page>
    </>
  )
}

export default Index

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const { data: transactions } = await apolloClient.query({
    query: TRANSACTIONS_LAST,
  })
  const { data: blocks } = await apolloClient.query({
    query: BLOCKS_LAST,
  })
  const { data: chainStats } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  return addApolloState(apolloClient, {
    props: {
      ...transactions,
      ...blocks,
      ...chainStats,
    },
  })
}
