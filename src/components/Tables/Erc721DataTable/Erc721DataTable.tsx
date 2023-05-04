import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { erc20Columns } from './columns'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Loading from '@/components/Loading'
import { GET_ERC721_BY_ADDRESS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const PER_PAGE = 10

interface IErc20DataTableProps {
  address: string
}

export const Erc721DataTable: FC<IErc20DataTableProps> = ({ address }) => {
  const [getErc20, { data, loading, previousData }] = useLazyQuery(
    GET_ERC721_BY_ADDRESS
  )

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

  const displayData = loading ? previousData : data

  if (!displayData && loading) {
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
      data={displayData?.erc721Events?.data || []}
      total={displayData?.erc721Events?.total}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No ERC-721 events',
        subtitle: `for ${address}`,
      }}
    />
  )
}

export default Erc721DataTable
