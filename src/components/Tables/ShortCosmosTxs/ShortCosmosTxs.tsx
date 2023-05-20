import { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import clsx from 'clsx'
import pageStyles from '../../../pages/Pages.module.scss'
import { cosmosTxsColumns } from './columns'
import { CosmosTransactionModel } from '@/__generated__/resolvers-types'
import Table from '@/components/Table/Table'
import { GET_COSMOS_TRANSACTIONS } from '@/lib/apollo/queries'
import { ITEMS_PER_PAGE } from '@/pages'
import styles from './ShortCosmos.module.scss'

export const ShortCosmosTxsTable: FC = () => {
  const [cosmosTransactions, setCosmosTransactions] = useState<
    CosmosTransactionModel[] | null
  >()

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
      data={cosmosTransactions || [...Array(ITEMS_PER_PAGE)]}
      showHeader={false}
      className={clsx(styles.cardChild, {
        [pageStyles.tablePreloader]: !cosmosTransactions,
      })}
      getRowKey={cosmosTransactions ? (data) => data.hash : undefined}
    />
  )
}

export default ShortCosmosTxsTable
