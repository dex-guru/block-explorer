import { TokenBalanceModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import {
  IconContract,
  IconLiquidityPool,
  IconNoIcon,
  IconWallet,
} from '@/components/Icons'
import Label from '@/components/Label'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import Value from '@/components/Value'
import { financialFormat } from '@/lib/utils'
import styles from './HoldersDataTable.module.scss'

export const holdersColumns = (skip: number): IColumn<TokenBalanceModel>[] => [
  {
    accessor: 'address',
    title: 'Rank',
    modifier: 'rank',
    render: (_data, _placeholder, idx) => (
      <span className={styles.muted}>{skip + (idx || 0) + 1}</span>
    ),
  },

  {
    accessor: 'address',
    title: 'Address',
    modifier: 'address',
    render: (data) => {
      let icon

      switch (data.holderType) {
        case 'wallet':
          icon = (
            <IconWallet
              data-tooltip-id="app-tooltip"
              data-tooltip-content="Externally Owned Account"
              className={styles.typeIcon}
            />
          )
          break
        case 'smart_contract':
          icon = (
            <IconContract
              data-tooltip-id="app-tooltip"
              data-tooltip-content="Smart Contract"
              className={styles.typeIcon}
            />
          )
          break
        case 'liquidity_pool':
          icon = (
            <IconLiquidityPool
              data-tooltip-id="app-tooltip"
              data-tooltip-content="Liquidity Pool"
              className={styles.typeIcon}
            />
          )
          break
        default:
          icon = <IconNoIcon className={styles.typeIcon} />
      }

      return (
        <Value
          className={styles.token}
          value={<Address address={data.address} type="account" isCopy />}
          icon={icon}
        />
      )
    },
  },

  {
    accessor: 'label',
    title: 'Label',
    render: (data) => <Label className={styles.label}>{data.label}</Label>,
  },

  {
    accessor: 'percentage',
    title: 'Supply Owned',
    type: 'number',
    render: (data) => (
      <>
        <Value
          value={financialFormat((data.percentage || 0) * 100)}
          suffix="%"
        />
        <progress max="100" value={(data.percentage || 0) * 100} />
      </>
    ),
  },

  {
    accessor: 'quantity',
    title: 'Value',
    type: 'number',
    render: (data) => {
      return (
        <Tile
          className={styles.valueNativeWithStable}
          title={<Value value={financialFormat(data.quantity)} />}
          postfix={<Value prefix="$" value={financialFormat(data.value)} />}
        />
      )
    },
  },
]
