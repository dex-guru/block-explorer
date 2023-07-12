import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import DataTable from '@/components/DataTable'
import Error from '@/components/Error'
import Loading from '@/components/Loading'
import { transfersColumns } from '@/components/Table/columns/transfersColumns'
import { useIsMount } from '@/hooks'
import { GET_ERC20_EVENTS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './TransfersDataTable.module.scss'

const PER_PAGE = 10

interface ITransfersDataTableProps {
  address?: string
}

export const TransfersDataTable: FC<ITransfersDataTableProps> = ({
  address,
}) => {
  const [getErc2Events, { data, loading, previousData }] = useLazyQuery<{
    erc20Events: { data: Erc20EventModel[]; total: number }
  }>(GET_ERC20_EVENTS)
  const isMount = useIsMount()

  const getVariables = useCallback(
    (vars?: PaginationVariables) => {
      return {
        first: PER_PAGE,
        skip: 0,
        eventTypes: 'transfers',
        address: address?.toLowerCase(),

        ...vars,
      }
    },
    [address]
  )

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getErc2Events({
        variables: getVariables(variables),
      })
    },
    [getErc2Events, getVariables]
  )

  useEffect(() => {
    getErc2Events({
      variables: getVariables(),
    })
  }, [getErc2Events, getVariables])

  const displayData = loading ? previousData : data
  const subtitle = address ? `for ${address}` : undefined

  if (isMount && !data && !loading) {
    return (
      <Error
        className={styles.error}
        title="Error while receiving transfers"
        subtitle={subtitle}
        actions={[
          {
            className: styles.retry,
            caption: 'Retry?',
            onClick: () =>
              getErc2Events({
                variables: getVariables(),
              }),
          },
        ]}
      />
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
      columns={transfersColumns}
      data={displayData?.erc20Events.data || []}
      total={displayData?.erc20Events?.total}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No transactions',
        subtitle: subtitle,
      }}
    />
  )
}

export default TransfersDataTable
