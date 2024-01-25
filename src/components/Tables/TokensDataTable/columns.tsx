import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Delta from '@/components/Delta'
import { IconContract } from '@/components/Icons'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import Value from '@/components/Value'
import { financialFormat } from '@/lib/utils'

import styles from './TokensDataTable.module.scss'

export const tokensColumns: IColumn<TokenHoldingsModel>[] = [
  {
    accessor: 'asset',
    title: 'Asset',
    render: (data) => (
      <Token
        logo={data.logo[0]}
        name={data.asset}
        symbol={data.symbol[0]}
        address={data.contractAddress}
      />
    ),
  },
  {
    accessor: 'contractAddress',
    title: 'Contract Address',
    render: (data) => {
      return (
        <Value
          className={styles.holder}
          value={<Address address={data.contractAddress} type="account" isCopy />}
          icon={
            <IconContract
              data-tooltip-id="app-tooltip"
              data-tooltip-content="Smart Contract"
              className={styles.typeIcon}
            />
          }
        />
      )
    },
  },

  {
    accessor: 'quantity',
    title: 'Quantity',
    type: 'number',
    render: (data) => financialFormat(data.quantity),
  },

  {
    accessor: 'price',
    title: 'Price',
    type: 'number',
    render: (data) => <Value value={financialFormat(data.price)} prefix="$" />,
  },

  {
    accessor: 'change24H',
    title: 'Price Change, 24h',
    type: 'number',
    render: (data) => <Delta value={data.change24H * 100} />,
  },

  {
    accessor: 'value',
    title: 'Value in USD',
    type: 'number',
    render: (data) => financialFormat(data.value),
  },
]
