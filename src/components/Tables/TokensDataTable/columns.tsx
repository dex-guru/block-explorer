import Image from 'next/image'
import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import { Address, Delta, IconContract, Tile, Value } from '@/components'
import { IColumn } from '@/components/Table/types'
import IconNoImage from '@/images/icons/question.svg'
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
        <IconNoImage className={styles.noimage} />
      )

      return <Tile className={styles.token} icon={icon} title={data.asset} />
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
          icon={<IconContract className={styles.typeIcon} />}
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
