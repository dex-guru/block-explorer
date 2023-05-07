import { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { lastTxsColumns } from './columns'
import {
  ChainConfigModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Table from '@/components/Table/Table'
import { TRANSACTIONS_LAST } from '@/lib/apollo/queries'
import styles from './ShortTxs.module.scss'

interface IShortTxsTableProps {
  data: TransactionModel[]
  chainConfig: ChainConfigModel
}

export const ShortTxsTable: FC<IShortTxsTableProps> = (props) => {
  const [transactions, setTransactions] = useState<TransactionModel[]>(
    props.data
  )

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
      data={transactions}
      showHeader={false}
      className={styles.cardChild}
      getRowKey={(data) => data.hash}
    />
  )
}

export default ShortTxsTable
