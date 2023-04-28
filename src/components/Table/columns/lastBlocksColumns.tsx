import Link from 'next/link'
import { BlockModel } from '@/__generated__/resolvers-types'
import { Address, Label, Tile, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'

export type BlockModelWithTimeDiff = BlockModel & { timeDiff: number }

export const lastBlocksColumns: IColumn<BlockModelWithTimeDiff>[] = [
  {
    accessor: 'hash',
    render: (data) => (
      <Tile
        letters="Bk"
        title={<Address address={`${data.number}`} type="block" />}
        postfix={<TimeAgo timestamp={data.timestamp} />}
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
          <Link href="/">{data.transactionCount} txns</Link> in {data.timeDiff}{' '}
          sec
        </small>
      </div>
    ),
  },
  {
    accessor: 'gasUsed',
    type: 'number',
    render: (data) => {
      if (!data.gasUsed || data.gasUsed === '0') {
        return null
      }

      const gasUtilization = financialFormat(
        ((data.gasUsed || 0) / data.gasLimit) * 100,
        {
          decimals: 2,
        }
      )

      return <Label title={`${gasUtilization}%`} type="accent" />
    },
  },
]
