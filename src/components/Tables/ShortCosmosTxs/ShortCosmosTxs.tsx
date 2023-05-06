import { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { cosmosTxsColumns } from './columns'
import { CosmosTransactionModel } from '@/__generated__/resolvers-types'
import Table from '@/components/Table/Table'
import { GET_COSMOS_TRANSACTIONS } from '@/lib/apollo/queries'
import styles from './ShortCosmos.module.scss'

interface IShortCosmosTxsTableProps {
  data: CosmosTransactionModel[]
}

export const ShortCosmosTxsTable: FC<IShortCosmosTxsTableProps> = (props) => {
  const [cosmosTransactions, setCosmosTransactions] = useState<
    CosmosTransactionModel[]
  >(props.data)

  const { data, loading } = useQuery<{
    cosmos: { transactions: CosmosTransactionModel[] }
  }>(GET_COSMOS_TRANSACTIONS, {
    pollInterval: Number(process.env.pollInterval),
  })

  useEffect(() => {
    if (!loading && data?.cosmos?.transactions?.length) {
      setCosmosTransactions(data.cosmos.transactions)
    }
  }, [data, loading])

  return (
    <Table
      columns={cosmosTxsColumns()}
      data={cosmosTransactions}
      showHeader={false}
      className={styles.cardChild}
    />
  )
}

export default ShortCosmosTxsTable
