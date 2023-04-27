import Link from 'next/link'
import { BlockModel } from '@/__generated__/resolvers-types'
import { Address, Label, Tile } from '@/components'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'

export const lastBlocksColumns: IColumn<BlockModel>[] = [
  {
    accessor: 'hash',
    render: (data) => (
      <Tile
        letters="Bk"
        title={<Address address={`${data.number}`} type="block" />}
        // postfix={<TimeAgo timestamp={block.timestamp} />}
      />
    ),
  },
  {
    accessor: 'miner',
    render: (data) => (
      <div className="data-table__data">
        <div className="value">
          Miner <Address address={data.miner} type="account" />
        </div>
        <small className="value">
          <Link href="/">{data.transactionCount} txns</Link> in 😢 sec
        </small>
      </div>
    ),
  },
  {
    accessor: 'transactionCount',
    type: 'number',
    render: (data) => <Label title={financialFormat(data.transactionCount)} />,
  },
]
