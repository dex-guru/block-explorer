'use client'

import { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import Link from 'next/link'
import { ITEMS_PER_PAGE } from '../constants'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
  CsrStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Card, Grid, Page, Summary, Table, Value } from '@/components'
import {
  BlockModelWithTimeDiff,
  lastBlocksColumns,
} from '@/components/Table/columns/lastBlocksColumns'
import ShortCosmosTxsTable from '@/components/Tables/ShortCosmosTxs'
import { ShortTxsTable } from '@/components/Tables/ShortTxs'
import Tabs from '@/components/Tabs'
import { GET_BLOCKS_SHORT } from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getBlocksWithTimeDiff,
} from '@/lib/utils'
import styles from './Pages.module.scss'

export interface IndexProps {
  transactions: TransactionModel[]
  blocks: BlockModelWithTimeDiff[]
  chainStats: ChainStatsModel
  csrStats: CsrStatsModel
  chainConfig: ChainConfigModel
}

const Index: FC<IndexProps> = (props) => {
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
      id: 'txHistory',
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
          suffix={
            <>
              &nbsp;
              {financialFormat(stats.transactionsPerSecond, {
                decimals: 2,
              })}{' '}
              txs/sec
            </>
          }
        />
      ),
    },
    {
      title: 'Active Addresses',
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
      value: (
        <Value
          value={financialFormatLowValueHighPrecision(
            stats.smartContractsCount
          )}
        />
      ),
    },
    {
      title: `${chainConfig.nativeCurrency.symbol} Supply`,
      value: financialFormatLowValueHighPrecision(stats.tokenSupply),
    },
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
  props.csrStats &&
    statsDisplay.push({
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
    })

  return (
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
            chainConfig.features.some((x) => x.name === 'cosmos') ? (
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
  )
}

export default Index
