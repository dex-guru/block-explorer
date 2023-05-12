import { FC, useCallback, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { erc20Columns } from './columns'
import { Error } from '@/components'
import DataTable from '@/components/DataTable'
import { LoadingCard } from '@/components/Loading'
import { useIsMount } from '@/hooks'
import { GET_ERC20_BY_ADDRESS } from '@/lib/apollo/queries'
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
    useLazyQuery(GET_ERC20_BY_ADDRESS)
  const isMount = useIsMount()

  const addressVar = useMemo(
    () =>
      isWalletAddress
        ? { walletAddress: address?.toLowerCase() }
        : { address: address?.toLowerCase() },
    [address, isWalletAddress]
  )

  const getVariables = useCallback(
    (vars?: PaginationVariables) => {
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
      columns={erc20Columns}
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

export default Erc20DataTable
