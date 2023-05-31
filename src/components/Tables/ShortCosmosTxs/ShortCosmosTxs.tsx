import { FC } from 'react'
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import { cosmosTxsColumns } from './columns'
import {
  ChainConfigModel,
  CosmosTransactionModel,
} from '@/__generated__/resolvers-types'
import Table from '@/components/Table/Table'
import { GET_COSMOS_TRANSACTIONS } from '@/lib/apollo/queries'
import { ITEMS_PER_PAGE } from '@/pages'
import styles from './ShortCosmos.module.scss'

interface IShortCosmosTxsTableProps {
  chainConfig: ChainConfigModel
}

export const ShortCosmosTxsTable: FC<IShortCosmosTxsTableProps> = (props) => {
  const { data, previousData } = useQuery<{
    cosmos: { transactions: CosmosTransactionModel[] }
  }>(GET_COSMOS_TRANSACTIONS, {
    pollInterval: Number(
      props.chainConfig?.blockTime || process.env.pollInterval
    ),
  })

  const hasData = data?.cosmos.transactions || previousData?.cosmos.transactions

  const dataDisplay = hasData || [...Array(ITEMS_PER_PAGE)]

  return (
    <Table
      columns={cosmosTxsColumns()}
      data={dataDisplay}
      showHeader={false}
      className={clsx(styles.cardChild, {
        [styles.tablePreloader]: !hasData,
      })}
      getRowKey={previousData ? (data) => data?.hash : undefined}
    />
  )
}

export default ShortCosmosTxsTable
