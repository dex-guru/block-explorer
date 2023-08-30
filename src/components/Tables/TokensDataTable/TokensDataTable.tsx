import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { tokensColumns } from './columns'
import {
  TokenHoldingsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import DataTable from '@/components/DataTable'
import { IconNoData, IconWarehouse } from '@/components/Icons'
import StateView from '@/components/StateView'
import { useIsMount } from '@/hooks'
import { GET_ADDRESS_TOKENS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './TokensDataTable.module.scss'

const PER_PAGE = 10

interface ITokensDataTableProps {
  address?: string
}

export const TokensDataTable: FC<ITokensDataTableProps> = ({ address }) => {
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
              getHolders({
                variables: getVariables(),
              }),
          },
        ]}
      />
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
      header={
        <Button
          icon={<IconWarehouse />}
          caption="SQL Query"
          className={styles.warehouse}
          data-tooltip-id="app-tooltip"
          data-tooltip-content={`Open query in Warehouse`}
          target="_blank"
          rel="noreferrer noopener"
          href={`${process.env.NEXT_PUBLIC_REDASH_URL}/queries/58`}
        />
      }
      empty={{
        title: 'No transactions',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default TokensDataTable
