import { TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Label, Tile } from '@/components'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'

export const lastTxsColumns: IColumn<TransactionModel>[] = [
  {
    accessor: 'hash',
    title: 'Block',
    render: (data) => (
      <Tile
        letters="Tx"
        avatarType="rounded"
        title={<Address address={data.hash} type="tx" />}
        // postfix={<TimeAgo timestamp={data.blockTimestamp} />}
      />
    ),
  },
  {
    accessor: 'fromAddress',
    render: (data) => (
      <div className="data-table__data">
        <div className="value">
          From <Address address={data.fromAddress} type="account" />
        </div>
        {!!data.toAddress && (
          <div className="value">
            To <Address address={data.toAddress} type="account" />
          </div>
        )}
      </div>
    ),
  },
  {
    accessor: 'value',
    type: 'number',
    render: (data) => <Label title={getNormalizedValue(data.value)} />,
  },
]
