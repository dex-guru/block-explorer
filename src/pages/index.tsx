import { useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
  CsrStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import Grid from '@/components/Grid'
import Page from '@/components/Page'
import Summary from '@/components/Summary'
import Table from '@/components/Table'
import {
  BlockModelWithTimeDiff,
  lastBlocksColumns,
} from '@/components/Table/columns/lastBlocksColumns'
import ShortCosmosTxsTable from '@/components/Tables/ShortCosmosTxs'
import { ShortTxsTable } from '@/components/Tables/ShortTxs'
import Value from '@/components/Value'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import {
  GET_BLOCKS_SHORT,
  GET_BLOCKS_TXNS_CHAIN_STATS,
} from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import {
  checkChainFeature,
  financialFormat,
  financialFormatLowValueHighPrecision,
  getBlocksWithTimeDiff,
} from '@/lib/utils'
import styles from './Pages.module.scss'

const Tabs = dynamic(() => import('@/components/Tabs'), {
  ssr: false,
})

interface IndexProps {
  transactions: TransactionModel[]
  blocks: BlockModelWithTimeDiff[]
  chainStats: ChainStatsModel
  csrStats: CsrStatsModel
  chainConfig: ChainConfigModel
}

export const ITEMS_PER_PAGE = 10

const Index: NextPage<IndexProps> = (props) => {
  const { chainStats: stats, chainConfig } = props
  const [blocks, setBlocks] = useState<BlockModelWithTimeDiff[]>(props.blocks)

  const [isCosmos, setIsCosmos] = useState(false)

  const { data: blocksUpdate, loading } = useQuery<{ blocks: BlockModel[] }>(
    GET_BLOCKS_SHORT,
    {
      variables: { first: ITEMS_PER_PAGE + 1, skip: 0 },
      pollInterval: Number(chainConfig?.blockTime || process.env.pollInterval),
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
      id: 'Transactions',
      data: stats.transactionsCountHistory,
    },
  ]

  const lastBlockNumber = Math.max(
    blocks[0]?.number,
    props.chainStats.lastBlockNumber
  )

  const statsDisplay = [
    {
      title: 'Last Block Number',
      value: financialFormatLowValueHighPrecision(lastBlockNumber),
    },
    {
      title: 'Transactions',
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(stats.transactionsCount)}
        />
      ),
    },
    {
      title: 'TPS',
      tooltip:
        'Transactions Per Second (TPS) refers to the number of transactions that a blockchain can handle in one second. Calculated as: Amount of TXs in last block / Block time.',
      value: (
        <Value
          value={financialFormat(stats.transactionsPerSecond, {
            decimals: 2,
          })}
          suffix={<>&nbsp;txs/sec</>}
        />
      ),
    },
    {
      title: 'Total Addresses',
      tooltip:
        'Total of distinct address numbers who send at least one transaction on-chain.',
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(
            stats.activeAddressesCount
          )}
        />
      ),
    },
    {
      title: 'Smart Contracts',
      tooltip: 'Total number of smart contracts created on-chain.',
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(
            stats.smartContractsCount
          )}
        />
      ),
    },
    // {
    //   title: `${chainConfig.nativeCurrency.symbol} Max Supply`,
    //   tooltip:
    //     'The maximum number of coins or tokens that will ever exist for a particular cryptocurrency.',
    //   value: financialFormatLowValueHighPrecision(stats.tokenSupply),
    // },
    {
      title: `${chainConfig.nativeCurrency.symbol} Price`,
      value: (
        <Value
          value={financialFormat(stats.nativeTokenPriceUsd)}
          prefix="$"
          delta={stats.nativeTokenPriceUsd24hDelta * 100}
        />
      ),
    },
  ]

  if (checkChainFeature(chainConfig, 'csr') && props.csrStats) {
    statsDisplay.push({
      title: 'Contract Secured Revenue (CSR)',
      tooltip:
        'Contract Secured Revenue (CSR) allows smart contract owners to claim a percentage of all transaction fees paid by users when interacting with smart contracts.',
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
    })
  }

  const pageTitle = `${chainConfig.name}${
    chainConfig.chain ? ` ${chainConfig.chain}` : ''
  } Block Explorer`
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Discover the power of ${chainConfig.name} blockchain with our reliable block explorer. Track transactions, explore blocks, and view network statistics in real time. Perfect for beginners and experts alike.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={props.chainConfig}>
        {!!stats && (
          <Summary
            stats={statsDisplay}
            charts={[
              {
                title: 'Transaction History in 14 days',
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
              checkChainFeature(chainConfig, 'cosmos') ? (
                <Tabs
                  tabs={[
                    { title: 'EVM', value: 'evm' },
                    { title: 'Cosmos', value: 'cosmos' },
                  ]}
                  className={styles.switch}
                  value={isCosmos ? 'cosmos' : 'evm'}
                  onChange={(value) => {
                    setIsCosmos(value === 'cosmos')
                  }}
                />
              ) : undefined
            }
            actions={
              !isCosmos
                ? [
                    {
                      caption: 'View all transactions',
                      to: '/txs',
                    },
                  ]
                : undefined
            }
          >
            {isCosmos && <ShortCosmosTxsTable chainConfig={chainConfig} />}

            {!isCosmos && (
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
  const logger = getLogger('homepage')

  const apolloClient = initializeApollo({ ctx })

  const { data, error } = await apolloClient.query({
    query: GET_BLOCKS_TXNS_CHAIN_STATS,
    // per_page + 1 - last item needs for time diff
    variables: { first: ITEMS_PER_PAGE + 1, skip: 0 },
  })

  error
    ? logger.error(error, 'Error getting GET_BLOCKS_TXNS_CHAIN_STATS info')
    : logger.info({ msg: 'Got GET_BLOCKS_TXNS_CHAIN_STATS info', data })

  const blocksWithTimeDiff = getBlocksWithTimeDiff(
    data?.blocks || [],
    ITEMS_PER_PAGE
  )

  return addApolloState(apolloClient, {
    props: {
      ...data,
      blocks: blocksWithTimeDiff,
    },
  })
}
