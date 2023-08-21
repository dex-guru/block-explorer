import { FC, useCallback, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { erc20Columns } from './columns'
import DataTable from '@/components/DataTable'
import { IconNoData } from '@/components/Icons'
import StateView from '@/components/StateView'
import { useIsMount } from '@/hooks'
import { GET_ERC20_EVENTS, GET_ERC20_EVENTS_TOTALS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './Erc20DataTable.module.scss'

const PER_PAGE = 10

interface IErc20DataTableProps {
  address?: string
  isWalletAddress?: boolean
}

export const Erc20DataTable: FC<IErc20DataTableProps> = ({
  address,
  isWalletAddress,
}) => {
  const [getErc20, { data, loading, previousData }] =
    useLazyQuery(GET_ERC20_EVENTS)
  const [getErc20Totals, { data: fullTotalsData }] = useLazyQuery(
    GET_ERC20_EVENTS_TOTALS
  )
  const isMount = useIsMount()

  const addressVar = useMemo(
    () =>
      isWalletAddress
        ? { walletAddress: address?.toLowerCase() }
        : { address: address?.toLowerCase() },
    [address, isWalletAddress]
  )

  const getVariables = useCallback(
    (vars?: Record<string, string | number | boolean>) => {
      return {
        ...addressVar,

        first: PER_PAGE,
        skip: 0,

        ...vars,
      }
    },
    [addressVar]
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

  const handleGetFullTotal = () =>
    getErc20Totals({
      variables: getVariables({ fullTotals: true }),
    })

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <StateView
        icon={<IconNoData className={styles.icon} />}
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

  return (
    <DataTable
      isLoading={loading}
      columns={erc20Columns(displayData?.chainConfig?.dexes)}
      data={displayData?.erc20Events?.data}
      total={displayData?.erc20Events?.total}
      fullTotal={fullTotalsData?.erc20Events?.total}
      getFullTotal={handleGetFullTotal}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No ERC-20 events',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default Erc20DataTable
