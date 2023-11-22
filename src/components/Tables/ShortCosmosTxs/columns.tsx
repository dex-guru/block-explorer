import styles from '../../../pages/Pages.module.scss'
import { CosmosTransactionModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IconTx } from '@/components/Icons'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import TimeAgo from '@/components/TimeAgo'

export const cosmosTxsColumns = (): IColumn<CosmosTransactionModel>[] => [
  {
    accessor: 'hash',
    title: 'Block',
    render: (data) => (
      <Tile
        icon={<IconTx className={styles.mutedIcon} />}
        title={
          <Address address={data.hash} type="cosmos" isCopy isLink={false} />
        }
        postfix={<TimeAgo timestamp={data.blockTimestamp} />}
      />
    ),
  },
  {
    accessor: 'number',
    title: 'Block',
    type: 'number',
    render: (data) => (
      <Address address={`${data.blockNumber}`} type="block" isLink={false} />
    ),
  },
]
