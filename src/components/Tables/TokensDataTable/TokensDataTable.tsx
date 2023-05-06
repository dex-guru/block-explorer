import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { tokensColumns } from './columns'
import {
  TokenHoldingsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
import { useIsMount } from '@/hooks'
import { GET_ADDRESS_TOKENS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './TokensDataTable.module.scss'

const PER_PAGE = 10

interface ITokensDataTableProps {
  address?: string
}

export const HoldersDataTable: FC<ITokensDataTableProps> = ({ address }) => {
  const [getHolders, { data, loading, previousData }] = useLazyQuery<{
    tokenHoldings: TokenHoldingsModel[]
    tokenHoldingsStats: TokenHoldingsStatsModel
  }>(GET_ADDRESS_TOKENS)
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
        title="Error while receiving transactions"
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

  return (
    <DataTable
      isLoading={loading}
      columns={tokensColumns}
      data={displayData?.tokenHoldings || []}
      total={displayData?.tokenHoldingsStats?.tokenCount || 0}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No transactions',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default HoldersDataTable
