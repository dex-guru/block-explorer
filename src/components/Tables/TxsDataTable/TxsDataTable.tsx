import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Loading from '@/components/Loading'
import { txsColumns } from '@/components/Table'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const PER_PAGE = 10

interface ITxsDataTableProps {
  address: string
  chain: {
    stats: ChainStatsModel
    config: ChainConfigModel
  }
}

export const TxsDataTable: FC<ITxsDataTableProps> = ({ address, chain }) => {
  const [getTransactions, { data, loading, previousData }] =
    useLazyQuery(GET_TRANSACTIONS)

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

  if (!displayData && loading) {
    return (
      <Card>
        <Loading />
      </Card>
    )
  }

  return (
    <DataTable
      isLoading={loading}
      columns={txsColumns(chain.config, chain.stats)}
      data={displayData?.transactions}
      total={displayData?.transactionStats?.transactionsCount}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No transactions',
        subtitle: `for ${address}`,
      }}
    />
  )
}

export default TxsDataTable
