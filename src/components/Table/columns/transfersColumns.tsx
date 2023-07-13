import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'

export const transfersColumns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'hash',
    title: 'TX Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" isCopy />,
  },
  {
    accessor: 'blockTimestamp',
    title: 'Age',
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
  },
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) =>
      data.fromAddress ? (
        <Address address={data.fromAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.toAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'value',
    title: 'Quantity',
    type: 'number',
    render: (data) => {
      return financialFormatLowValueHighPrecision(data.amounts[0])
    },
  },
]
