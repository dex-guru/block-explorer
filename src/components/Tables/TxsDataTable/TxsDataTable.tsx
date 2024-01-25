import { FC, useCallback, useEffect } from 'react'

import { useLazyQuery } from '@apollo/client'

import {
  ChainConfigModel,
  ChainStatsModel,
  TransactionModel,
  TransactionStatsModel,
} from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import DataTable from '@/components/DataTable'
import { IconNoData, IconWarehouse } from '@/components/Icons'
import StateView from '@/components/StateView'
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

  const getVariables = useCallback(
    (vars?: PaginationVariables) => {
      return {
        first: PER_PAGE,
        skip: 0,
        blockNumber: block,
        address: address?.toLowerCase(),

        ...vars,
      }
    },
    [address, block]
  )

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getTransactions({
        variables: getVariables(variables),
      })
    },
    [getTransactions, getVariables]
  )

  useEffect(() => {
    getTransactions({
      variables: getVariables(),
    })
  }, [getTransactions, getVariables])

  const displayData = loading ? previousData : data
  const subtitle = address ? `for ${address}` : block ? `for block #${block}` : undefined

  if (isMount && !data && !loading) {
    return (
      <StateView
        icon={<IconNoData className={styles.icon} />}
        className={styles.error}
        title="Error while receiving transactions"
        subtitle={subtitle}
        actions={[
          {
            className: styles.retry,
            caption: 'Retry?',
            onClick: () =>
              getTransactions({
                variables: getVariables(),
              }),
          },
        ]}
      />
    )
  }

  return (
    <DataTable
      header={
        <Button
          icon={<IconWarehouse />}
          caption="SQL query"
          data-tooltip-id="app-tooltip"
          data-tooltip-content={`Open query in Warehouse`}
          className={styles.warehouse}
          target="_blank"
          rel="noreferrer noopener"
          href={`${process.env.NEXT_PUBLIC_REDASH_URL}/queries/${address ? 72 : 75}`}
        />
      }
      isLoading={loading}
      columns={txsColumns(displayData?.chainConfig, displayData?.chainStats)}
      data={displayData?.transactions || []}
      total={displayData?.transactionStats?.transactionsCount}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No transactions',
        subtitle: subtitle,
      }}
    />
  )
}

export default TxsDataTable
