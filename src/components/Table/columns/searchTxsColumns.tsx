import { TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Tile, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'

export const searchTxsColumns: IColumn<TransactionModel>[] = [
  {
    accessor: 'hash',
    modifier: 'address',
    render: (data) => (
      <Tile
        title={
          <>
            TX <Address address={data.hash} type="tx" isCopy />
          </>
        }
        postfix={
          <>
            <TimeAgo timestamp={data.blockTimestamp} /> in{' '}
            <Address address={`${data.blockNumber}`} type="block" isCopy />
          </>
        }
      />
    ),
  },
  {
    accessor: 'fromAddress',
    modifier: 'address',
    render: (data) => (
      <>
        {!!data.fromAddress && (
          <div>
            From: <Address address={data.fromAddress} type="account" isCopy />
          </div>
        )}
        {!!data.toAddress && (
          <div>
            To: <Address address={data.toAddress} type="account" isCopy />
          </div>
        )}
      </>
    ),
  },
  {
    accessor: 'value',
    title: 'Value',
    type: 'number',
    render: (data) => getNormalizedValue(data.value),
  },
]
