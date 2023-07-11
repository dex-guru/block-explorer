import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { dexTradesColumns } from './columns'
import { Error } from '@/components'
import DataTable from '@/components/DataTable'
import { LoadingCard } from '@/components/Loading'
import { useIsMount } from '@/hooks'
import { GET_ERC20_EVENTS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './DexTradesDataTable.module.scss'

const PER_PAGE = 10

interface IDexTradesDataTableProps {
  address: string
}

export const DexTradesDataTable: FC<IDexTradesDataTableProps> = ({
  address,
}) => {
  const [getErc20, { data, loading, previousData }] =
    useLazyQuery(GET_ERC20_EVENTS)
  const isMount = useIsMount()

  const addressStr = address?.toLowerCase()

  const getVariables = useCallback(
    (vars?: PaginationVariables) => {
      return {
        eventTypes: 'actions',
        address: addressStr,

        first: PER_PAGE,
        skip: 0,

        ...vars,
      }
    },
    [addressStr]
  )

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getErc20({
        variables: getVariables(variables),
      })
    },
    [getErc20, getVariables]
  )

  useEffect(() => {
    getErc20({
      variables: getVariables(),
    })
  }, [getErc20, getVariables])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <Error
        className={styles.error}
        title="Error while receiving ERC-20 events"
        subtitle={address ? `for ${address}` : undefined}
        actions={[
          {
            className: styles.retry,
            caption: 'Retry?',
            onClick: () => getErc20({ variables: getVariables() }),
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
      columns={dexTradesColumns(address)}
      data={displayData?.erc20Events?.data}
      total={displayData?.erc20Events?.total}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No ERC-20 events',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default DexTradesDataTable
