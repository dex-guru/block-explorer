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
  block?: number
}

export const TxsDataTable: FC<ITxsDataTableProps> = ({ address, block }) => {
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
          blockNumber: block,
          address,
          ...variables,
        },
      })
    },
    [block, address, getTransactions]
  )

  useEffect(() => {
    getTransactions({
      variables: {
        first: PER_PAGE,
        skip: 0,
        blockNumber: block,
        address,
      },
    })
  }, [block, address, getTransactions])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    const subtitle = address
      ? `for ${address}`
      : block
      ? `for block #${block}`
      : undefined

    return (
      <Empty
        className={styles.error}
        icon="🙀"
        title="Error while receiving transactions"
        subtitle={subtitle}
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
