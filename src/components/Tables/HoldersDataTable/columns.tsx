import { TokenBalanceModel } from '@/__generated__/resolvers-types'
import {
  Address,
  IconContract,
  IconLiquidityPool,
  IconQuestion,
  IconWallet,
  Label,
  Tile,
  Value,
} from '@/components'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'
import styles from './HoldersDataTable.module.scss'

export const holdersColumns: IColumn<TokenBalanceModel>[] = [
  {
    accessor: 'address',
    title: 'Address',
    modifier: 'address',
    render: (data) => {
      let Icon

      switch (data.holderType) {
        case 'wallet':
          Icon = IconWallet
          break
        case 'smart_contract':
          Icon = IconContract
          break
        case 'liquidity_pool':
          Icon = IconLiquidityPool
          break
        default:
          Icon = IconQuestion
      }

      return (
        <Value
          className={styles.token}
          value={<Address address={data.address} type="account" isCopy />}
          icon={<Icon className={styles.typeIcon} />}
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
    title: '%',
    type: 'number',
    render: (data) => (
      <Value value={financialFormat((data.percentage || 0) * 100)} suffix="%" />
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
