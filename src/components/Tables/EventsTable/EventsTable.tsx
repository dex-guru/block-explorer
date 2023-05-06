import { FC } from 'react'
import { useQuery } from '@apollo/client'
import { logsColumns } from './columns'
import DataTable from '@/components/DataTable'
import { GET_LOGS_BY_ADDRESS } from '@/lib/apollo/queries'

interface IEventsTableProps {
  address: string
}

export const EventsTable: FC<IEventsTableProps> = ({ address }) => {
  const { data, loading } = useQuery(GET_LOGS_BY_ADDRESS, {
    variables: { address: address.toLowerCase() },
  })

  if (loading || !data) {
    return null
  }

  return (
    <DataTable
      isLoading={loading}
      columns={logsColumns}
      data={data.logs}
      empty={{
        title: `No events for ${address}`,
      }}
    />
  )
}

export default EventsTable
