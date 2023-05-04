import { TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Avatar, Label, Tile, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'

export const lastTxsColumns: IColumn<TransactionModel>[] = [
  {
    accessor: 'hash',
    title: 'Block',
    render: (data) => (
      <Tile
        icon={<Avatar letters="Tx" type="rounded" />}
        title={<Address address={data.hash} type="tx" isCopy />}
        postfix={<TimeAgo timestamp={data.blockTimestamp} />}
      />
    ),
  },
  {
    accessor: 'fromAddress',
    render: (data) => (
      <div className="data-table__data">
        <div className="value">
          From <Address address={data.fromAddress} type="account" isCopy />
        </div>
        {!!data.toAddress && (
          <div className="value">
            To <Address address={data.toAddress} type="account" isCopy />
          </div>
        )}
      </div>
    ),
  },
  {
    accessor: 'value',
    type: 'number',
    render: (data) => {
      if (!data.value || data.value === '0') {
        return <></>
      }

      return <Label title={getNormalizedValue(data.value)} type="accent" />
    },
  },
]
