import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { nftColumns } from './columns'
import { Error } from '@/components'
import DataTable from '@/components/DataTable'
import { LoadingCard } from '@/components/Loading'
import { useIsMount } from '@/hooks'
import { GET_ERC721_BY_ADDRESS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './NftDataTable.module.scss'

const PER_PAGE = 10

interface INftDataTableProps {
  address?: string
  isWalletAddress?: boolean
}

export const NftDataTable: FC<INftDataTableProps> = ({ address }) => {
  const [getNfts, { data, loading, previousData }] = useLazyQuery(
    GET_ERC721_BY_ADDRESS
  )
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
      getNfts({
        variables: getVariables(variables),
      })
    },
    [getNfts, getVariables]
  )

  useEffect(() => {
    getNfts({
      variables: getVariables(),
    })
  }, [getNfts, getVariables])

  const displayData = loading ? previousData : data

  if (isMount && !data && !loading) {
    return (
      <Error
        className={styles.error}
        title="Error while receiving NFT events"
        subtitle={address ? `for ${address}` : undefined}
        actions={[
          {
            className: styles.retry,
            caption: 'Retry?',
            onClick: () =>
              getNfts({
                variables: getVariables(),
              }),
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
