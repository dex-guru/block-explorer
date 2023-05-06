import { FC, useCallback, useEffect, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client'
import { erc20Columns } from './columns'
import Button from '@/components/Button'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Empty from '@/components/Empty'
import Loading from '@/components/Loading'
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
    () => (isWalletAddress ? { walletAddress: address } : { address }),
    [address, isWalletAddress]
  )

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getErc20({
        variables: {
          ...addressVar,
          ...variables,
        },
      })
    },
    [addressVar, getErc20]
  )

  useEffect(() => {
    getErc20({
      variables: {
        first: PER_PAGE,
        ...addressVar,
        skip: 0,
      },
    })
  }, [addressVar, getErc20])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <Empty
        className={styles.error}
        icon="🙀"
        title="Error while receiving ERC-20 events"
        subtitle={address ? `for ${address}` : undefined}
      >
        <Button
          className={styles.retry}
          caption="Retry?"
          onClick={() => getErc20()}
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
