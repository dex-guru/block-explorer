import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { erc20Columns } from './columns'
import DataTable from '@/components/DataTable'
import { GET_ERC20_BY_ADDRESS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const PER_PAGE = 10

interface IErc20DataTableProps {
  address: string
}

export const Erc20DataTable: FC<IErc20DataTableProps> = ({ address }) => {
  const [getErc20, { data, loading }] = useLazyQuery(GET_ERC20_BY_ADDRESS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getErc20({ variables: { walletAddress: address, ...variables } })
    },
    [address, getErc20]
  )

  useEffect(() => {
    getErc20({
      variables: {
        first: PER_PAGE,
        walletAddress: '0x4a3ad752e6acd95d9ec8133ed7d00d6a934c47d6',
        skip: 0,
      },
    })
  }, [address, getErc20])

  if (loading || !data) {
    return null
  }

  return (
    <DataTable
      isLoading={loading}
      columns={erc20Columns}
      data={data?.erc20Events || []}
      total={100}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No erc20 events for this address',
      }}
    />
  )
}
