import { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import pageStyles from '../../../pages/Pages.module.scss'
import { lastTxsColumns } from './columns'
import {
  ChainConfigModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Table from '@/components/Table/Table'
import { TRANSACTIONS_LAST } from '@/lib/apollo/queries'
import { ITEMS_PER_PAGE } from '@/pages'
import styles from './ShortTxs.module.scss'

interface IShortTxsTableProps {
  chainConfig: ChainConfigModel
}

export const ShortTxsTable: FC<IShortTxsTableProps> = (props) => {
  const [transactions, setTransactions] = useState<TransactionModel[] | null>()

  const { data, loading } = useQuery<{
    transactions: TransactionModel[]
  }>(TRANSACTIONS_LAST, {
    pollInterval: Number(process.env.pollInterval),
  })

  useEffect(() => {
    if (!loading && data) {
      setTransactions(data.transactions)
    }
  }, [data, loading])

  return (
    <Table
      columns={lastTxsColumns(props.chainConfig)}
      data={transactions || [...Array(ITEMS_PER_PAGE)]}
      showHeader={false}
      className={clsx(styles.cardChild, {
        [pageStyles.tablePreloader]: !transactions,
      })}
      getRowKey={transactions ? (data) => data.hash : undefined}
    />
  )
}

export default ShortTxsTable
