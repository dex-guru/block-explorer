import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { nftColumns } from './columns'
import DataTable from '@/components/DataTable'
import { IconNoData } from '@/components/Icons'
import StateView from '@/components/StateView'
import { useIsMount } from '@/hooks'
import { GET_ERC721_EVENTS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './NftDataTable.module.scss'

const PER_PAGE = 10

interface INftDataTableProps {
  address?: string
  isWalletAddress?: boolean
}

export const NftDataTable: FC<INftDataTableProps> = ({ address }) => {
  const [getNfts, { data, loading, previousData }] =
    useLazyQuery(GET_ERC721_EVENTS)
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
      <StateView
        icon={<IconNoData className={styles.icon} />}
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

  return (
    <DataTable
      isLoading={loading}
      columns={nftColumns}
      data={displayData?.nftEvents?.data}
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
