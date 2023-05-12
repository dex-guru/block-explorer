import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { tokensColumns } from './columns'
import {
  TokenHoldingsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import { Error } from '@/components'
import DataTable from '@/components/DataTable'
import { LoadingCard } from '@/components/Loading'
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

  const getVariables = useCallback(
    (vars?: PaginationVariables) => {
      return {
        address: address?.toLowerCase(),

        first: PER_PAGE,
        skip: 0,

        ...vars,
      }
    },
    [address]
  )

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getHolders({
        variables: getVariables(variables),
      })
    },
    [getHolders, getVariables]
  )

  useEffect(() => {
    getHolders({
      variables: getVariables(),
    })
  }, [getHolders, getVariables])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    const subtitle = address ? `for ${address}` : undefined

    return (
      <Error
        className={styles.error}
        title="Error while receiving transactions"
        subtitle={subtitle}
        actions={[
          {
            className: styles.retry,
            caption: 'Retry?',
            onClick: () =>
              getHolders({
                variables: getVariables(),
              }),
          },
        ]}
      />
    )
  }

  if (!previousData && loading) {
    return <LoadingCard />
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
