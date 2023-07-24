import Image from 'next/image'
import Link from 'next/link'
import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { AddressValues } from '@/components/Address/helpers'
import Delta from '@/components/Delta'
import { IconContract, IconNoIcon } from '@/components/Icons'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import Value from '@/components/Value'
import { financialFormat } from '@/lib/utils'
import styles from './TokensDataTable.module.scss'

export const tokensColumns: IColumn<TokenHoldingsModel>[] = [
  {
    accessor: 'asset',
    title: 'Asset',
    render: (data) => {
      const icon = data.logo[0] ? (
        <Image
          src={data.logo[0]}
          alt={data.symbol.join('/')}
          width="32"
          height="32"
          className={styles.image}
        />
      ) : (
        <IconNoIcon className={styles.noimage} />
      )

      return (
        <Link href={AddressValues['token'].url(data.contractAddress) || ''}>
          <Tile className={styles.token} icon={icon} title={data.asset} />
        </Link>
      )
    },
  },

  {
    accessor: 'symbol',
    title: 'Symbol',
    render: (data) => data.symbol.join('/'),
  },

  {
    accessor: 'contractAddress',
    title: 'Contract Address',
    render: (data) => {
      return (
        <Value
          className={styles.holder}
          value={
            <Address address={data.contractAddress} type="account" isCopy />
          }
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
