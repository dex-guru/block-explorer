import { Erc721TransferModel } from '@/__generated__/resolvers-types'
import { Address, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'

export const erc20Columns: IColumn<Erc721TransferModel>[] = [
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" />,
  },
  {
    accessor: 'operatorAddress',
    title: 'Operator Address',
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
    render: (data) => getNormalizedValue(data.value),
  },
  {
    accessor: 'tokenAddress',
    title: 'Token',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.tokenAddress} type="account" />
      ) : null,
  },
]
