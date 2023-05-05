import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { nftColumns } from './columns'
import Button from '@/components/Button'
import DataTable from '@/components/DataTable'
import Empty from '@/components/Empty'
import { LoadingCard } from '@/components/Loading'
import { useIsMount } from '@/hooks'
import { GET_ERC721_BY_ADDRESS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './NftDataTable.module.scss'

const PER_PAGE = 10

interface INftDataTableProps {
  address?: string
}

export const NftDataTable: FC<INftDataTableProps> = ({ address }) => {
  const [getNfts, { data, loading, previousData }] = useLazyQuery(
    GET_ERC721_BY_ADDRESS
  )
  const isMount = useIsMount()

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getNfts({
        variables: {
          address,
          ...variables,
        },
      })
    },
    [address, getNfts]
  )

  useEffect(() => {
    getNfts({
      variables: {
        first: PER_PAGE,
        address,
        skip: 0,
      },
    })
  }, [address, getNfts])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <Empty
        className={styles.error}
        icon="🙀"
        title="Error while receiving NFT events"
        subtitle={address ? `for ${address}` : undefined}
      >
        <Button className={styles.retry} caption="Retry?" onClick={getNfts} />
      </Empty>
    )
  }

  if (!previousData && loading) {
    return <LoadingCard />
  }

  return (
    <DataTable
      isLoading={loading}
      columns={nftColumns}
      data={displayData?.nftEvents?.data || []}
      total={displayData?.nftEvents?.total}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No NFT events',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default NftDataTable
