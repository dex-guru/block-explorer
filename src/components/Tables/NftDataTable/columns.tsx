import { Erc721TransferModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import TimeAgo from '@/components/TimeAgo'

export const nftColumns: IColumn<Erc721TransferModel>[] = [
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
      data.fromAddress ? <Address address={data.fromAddress} type="account" isCopy /> : null,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? <Address address={data.toAddress} type="account" isCopy /> : null,
  },
  {
    accessor: 'tokenAddress',
    title: 'Item',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? <Address address={data.tokenAddress} type="account" isCopy /> : null,
  },
]
