import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { erc20Columns } from './columns'
import DataTable from '@/components/DataTable'
import { GET_ERC721_BY_ADDRESS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const PER_PAGE = 10

interface IErc20DataTableProps {
  address: string
}

export const Erc721DataTable: FC<IErc20DataTableProps> = ({ address }) => {
  const [getErc20, { data, loading }] = useLazyQuery(GET_ERC721_BY_ADDRESS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getErc20({
        variables: {
          address,
          ...variables,
        },
      })
    },
    [address, getErc20]
  )

  useEffect(() => {
    getErc20({
      variables: {
        first: PER_PAGE,
        address,
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
      data={data?.erc721Events?.data || []}
      total={data?.erc721Events?.total}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No erc721 events for this address',
      }}
    />
  )
}
