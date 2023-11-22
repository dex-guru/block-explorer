import styles from '../../../pages/Pages.module.scss'
import {
  ChainConfigModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IconTx } from '@/components/Icons'
import Label from '@/components/Label'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import TimeAgo from '@/components/TimeAgo'
import { getNormalizedValue } from '@/lib/utils'

export const lastTxsColumns = (
  chainConfig: ChainConfigModel
): IColumn<TransactionModel>[] => [
  {
    accessor: 'hash',
    title: 'Block',
    modifier: 'last-tx-hash',
    render: (data) => (
      <Tile
        icon={<IconTx className={styles.mutedIcon} />}
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
    modifier: 'last-tx-value',
    render: (data) => {
      if (!data.value || data.value === '0') {
        return <></>
      }

      return (
        <Label
          title={`${getNormalizedValue(
            data.value,
            chainConfig.nativeCurrency.decimals,
            { decimals: 7 }
          )} ${chainConfig.nativeCurrency.symbol}`}
          type="accent"
        />
      )
    },
  },
]
