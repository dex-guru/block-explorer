import { FC, useCallback, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { logsColumns } from './columns'
import DataTable from '@/components/DataTable'
import { IconNoData } from '@/components/Icons'
import StateView from '@/components/StateView'
import { useIsMount } from '@/hooks'
import { GET_LOGS_BY_ADDRESS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'
import styles from './EventsDataTable.module.scss'

interface IEventsDataTableProps {
  address: string
}

const PER_PAGE = 10

export const EventsDataTable: FC<IEventsDataTableProps> = ({ address }) => {
  const [getEvents, { data, loading, previousData }] =
    useLazyQuery(GET_LOGS_BY_ADDRESS)
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
      getEvents({
        variables: getVariables(variables),
      })
    },
    [getEvents, getVariables]
  )

  useEffect(() => {
    getEvents({
      variables: getVariables(),
    })
  }, [getEvents, getVariables])

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
            onClick: () => getEvents({ variables: getVariables() }),
          },
        ]}
      />
    )
  }

  return (
    <DataTable
      isLoading={loading}
      columns={logsColumns}
      data={displayData?.logs}
      total={displayData?.address?.receiptLogsCount}
      perPage={PER_PAGE}
      onPageChange={onPaginationChange}
      empty={{
        title: 'No log events',
        subtitle: address ? `for ${address}` : undefined,
      }}
    />
  )
}

export default EventsDataTable
