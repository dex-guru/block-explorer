import styles from '../../../pages/Pages.module.scss'
import {
  ChainConfigModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Address, IconTx, Label, Tile, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
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
