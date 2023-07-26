import { LogModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Label from '@/components/Label'
import { LogsView } from '@/components/LogsView'
import { IColumn } from '@/components/Table/types'

export const logsColumns: IColumn<LogModel>[] = [
  {
    accessor: 'hash',
    title: 'TX Hash',
    modifier: 'address',
    render: (data) => (
      <Address address={data.transactionHash} type="tx" isCopy />
    ),
  },
  {
    accessor: 'number',
    title: 'Block',
    render: (data) => (
      <Address address={`${data.blockNumber}`} type="block" isCopy />
    ),
  },

  {
    accessor: 'eventName',
    title: 'Event',
    render: (data) => <Label>{data.eventName}</Label>,
  },
  {
    accessor: 'logs',
    title: 'Logs',
    render: (data) => <LogsView key={data.data} log={data} />,
  },
]
