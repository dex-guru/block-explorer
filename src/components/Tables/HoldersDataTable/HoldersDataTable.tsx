import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { holdersColumns } from './columns'
import {
  TokenBalanceModel,
  TokenBalancesStatsModel,
} from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { useIsMount } from '@/hooks'
import { GET_ADDRESS_HOLDERS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './HoldersDataTable.module.scss'

const PER_PAGE = 10

interface IHoldersDataTableProps {
  address?: string
}

export const HoldersDataTable: FC<IHoldersDataTableProps> = ({ address }) => {
  const [getHolders, { data, loading, previousData }] = useLazyQuery<{
    balances: TokenBalanceModel[]
    balancesStats: TokenBalancesStatsModel
  }>(GET_ADDRESS_HOLDERS)
  const isMount = useIsMount()

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getHolders({
        variables: {
          address: address?.toLowerCase(),
          ...variables,
        },
      })
    },
    [address, getHolders]
  )

  useEffect(() => {
    getHolders({
      variables: {
        first: PER_PAGE,
        skip: 0,
        address: address?.toLowerCase(),
      },
    })
  }, [address, getHolders])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    const subtitle = address ? `for ${address}` : undefined

    return (
      <Empty
        className={styles.error}
        icon="🙀"
        title="Error while receiving holders"
        subtitle={subtitle}
      >
        <Button
          className={styles.retry}
          caption="Retry?"
          onClick={() =>
            getHolders({
              variables: {
                first: PER_PAGE,
                skip: 0,
                address: address?.toLowerCase(),
              },
            })
          }
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

  const holdersDisplay = displayData?.balances?.filter(
    (holder) => holder.address.toLowerCase() !== address?.toLowerCase()
  )

  return (
    <DataTable
      isLoading={loading}
      columns={holdersColumns}
      data={holdersDisplay || []}
      total={displayData?.balancesStats?.holders || 0}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No holders',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default HoldersDataTable
