import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ChainConfigModel,
  ChainStatsModel,
  TransactionModel,
  TransactionStatsModel,
} from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { txsColumns } from '@/components/Table'
import { useIsMount } from '@/hooks'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './TxsDataTable.module.scss'

const PER_PAGE = 10

interface ITxsDataTableProps {
  address?: string
}

export const TxsDataTable: FC<ITxsDataTableProps> = ({ address }) => {
  const [getTransactions, { data, loading, previousData }] = useLazyQuery<{
    transactions: TransactionModel[]
    transactionStats: TransactionStatsModel
    chainConfig: ChainConfigModel
    chainStats: ChainStatsModel
  }>(GET_TRANSACTIONS)
  const isMount = useIsMount()

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getTransactions({
        variables: {
          address,
          ...variables,
        },
      })
    },
    [address, getTransactions]
  )

  useEffect(() => {
    getTransactions({
      variables: {
        first: PER_PAGE,
        address,
        skip: 0,
      },
    })
  }, [address, getTransactions])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <Empty
        className={styles.error}
        icon="🙀"
        title="Error while receiving transactions"
        subtitle={address ? `for ${address}` : undefined}
      >
        <Button
          className={styles.retry}
          caption="Retry?"
          onClick={getTransactions}
        />
      </Empty>
    )
  }

  if (!previousData && loading) {
    return (
      <Card>
        <Loading />
      </Card>
    )
  }

  return (
    <DataTable
      isLoading={loading}
      columns={txsColumns(displayData?.chainConfig, displayData?.chainStats)}
      data={displayData?.transactions || []}
      total={displayData?.transactionStats?.transactionsCount}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No transactions',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default TxsDataTable
