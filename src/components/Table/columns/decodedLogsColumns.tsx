import { DecodedInputModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'

export const decodedLogsColumns: IColumn<DecodedInputModel>[] = [
  {
    accessor: 'name',
    title: 'Name',
    render: (data) => data.name,
  },
  {
    accessor: 'type',
    title: 'Type',
    render: (data) => data.type,
  },
  {
    accessor: 'isIndexed',
    title: 'Indexed?',
    type: 'center',
    render: (data) => (data.isIndexed ? 'true' : 'false'),
  },
  {
    accessor: 'value',
    title: 'Data',
    render: (data) => <Address address={data.value} isCopy />,
  },
]
