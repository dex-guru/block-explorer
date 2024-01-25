import { FC, useCallback, useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'

import { TokenBalanceModel, TokenBalancesStatsModel } from '@/__generated__/resolvers-types'
import DataTable from '@/components/DataTable'
import { IconNoData } from '@/components/Icons'
import StateView from '@/components/StateView'
import { useIsMount } from '@/hooks'
import { GET_ADDRESS_HOLDERS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

import { holdersColumns } from './columns'

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

  const [currentSkip, setCurrentSkip] = useState(0)

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
      setCurrentSkip(variables.skip)
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
        title="Error while receiving holders"
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

  const holdersDisplay = displayData?.balances?.filter(
    (holder) => holder.address.toLowerCase() !== address?.toLowerCase()
  )

  return (
    <DataTable
      isLoading={loading}
      columns={holdersColumns(currentSkip)}
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
