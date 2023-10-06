import { TransactionModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import TimeAgo from '@/components/TimeAgo'
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
            <TimeAgo timestamp={data.blockTimestamp} />
            {!!data.blockNumber ? (
              <>
                in{' '}
                <Address address={`${data.blockNumber}`} type="block" isCopy />
              </>
            ) : null}
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
