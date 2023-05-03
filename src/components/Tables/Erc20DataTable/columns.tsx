import { Erc20EventsModel } from '@/__generated__/resolvers-types'
import { Address, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'

export const erc20Columns: IColumn<Erc20EventsModel>[] = [
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" />,
  },
  {
    accessor: 'eventType',
    title: 'Event',
    modifier: 'address',
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
        <Address address={data.fromAddress} type="account" />
      ) : null,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.toAddress} type="account" />
      ) : null,
  },
  {
    accessor: 'amounts',
    title: 'Amounts',
    type: 'number',
    render: (data) => getNormalizedValue(data.amounts[0]),
  },
  {
    accessor: 'tokenAddresses',
    title: 'Token',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.tokenAddresses[0]} type="account" />
      ) : null,
  },
]
