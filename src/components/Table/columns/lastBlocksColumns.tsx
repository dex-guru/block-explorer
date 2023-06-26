import Link from 'next/link'
import styles from '../../../pages/Pages.module.scss'
import { BlockModel } from '@/__generated__/resolvers-types'
import { Address, IconBlock, Label, Tile, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'

export type BlockModelWithTimeDiff = BlockModel & { timeDiff: number }

export const lastBlocksColumns: IColumn<BlockModelWithTimeDiff>[] = [
  {
    accessor: 'number',
    modifier: 'last-block-number',
    render: (data) => (
      <Tile
        icon={<IconBlock className={styles.mutedIcon} />}
        title={<Address address={`${data.number}`} type="block" isCopy />}
        postfix={<TimeAgo timestamp={data.timestamp} />}
      />
    ),
  },
  {
    accessor: 'miner',
    render: (data) => {
      const txsCountDisplay = data.transactionCount ? (
        <Link href={`/txs?block=${data.number}`}>
          {data.transactionCount} txns
        </Link>
      ) : (
        '0 txns'
      )

      return (
        <div className="data-table__data">
          <div className="value">
            Validator <Address address={data.miner} type="account" isCopy />
          </div>
          <small className="value">
            {txsCountDisplay} in {data.timeDiff} sec
          </small>
        </div>
      )
    },
  },
  {
    accessor: 'gasUsed',
    type: 'number',
    modifier: 'last-block-gasUsed',
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

      return (
        <Label
          title={`${gasUtilization}%`}
          type="accent"
          tooltip="Gas Utilization"
        />
      )
    },
  },
]
