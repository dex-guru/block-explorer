import { TransactionModel } from '@/__generated__/resolvers-types'
import { Address, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import {
  financialFormatLowValueHighPrecision,
  getNormalizedValue,
} from '@/lib/utils'

export const txsColumns: IColumn<TransactionModel>[] = [
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" />,
  },
  {
    accessor: 'blockHash',
    title: 'Block',
    modifier: 'address',
    render: (data) => <Address address={data.blockHash} type="tx" />,
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
    accessor: 'value',
    title: 'Value',
    type: 'number',
    render: (data) => getNormalizedValue(data.value),
  },
]
