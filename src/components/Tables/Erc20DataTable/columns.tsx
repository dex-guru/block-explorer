import clsx from 'clsx'
import {
  ChainConfigModel,
  Erc20EventModel,
} from '@/__generated__/resolvers-types'
import { Address, Label, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import TokenIcon from '@/components/TokenIcon'
import { financialFormat } from '@/lib/utils'
import styles from './Erc20DataTable.module.scss'

export const erc20Columns = (
  chainConfig: ChainConfigModel
): IColumn<Erc20EventModel>[] => [
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" isCopy />,
  },
  {
    accessor: 'eventType',
    title: 'Event',
    modifier: 'address',
    render: (data) => (
      <Label className={clsx(styles.tag, styles[data.eventType])}>
        {data.eventType}
      </Label>
    ),
  },
  {
    accessor: 'blockTimestamp',
    title: 'Age',
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
  },
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) =>
      data.fromAddress ? (
        <Address address={data.fromAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.toAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'amounts',
    title: 'Amounts',
    type: 'number',
    render: (data) => financialFormat(data.amounts[0]),
  },
  {
    accessor: 'tokenAddresses',
    title: 'Token',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <div className={styles.tokenInfo}>
          <TokenIcon
            address={data.tokenAddresses[0]}
            network={chainConfig?.name || ''}
            alt={data.tokenSymbols[0]}
          />
          <Address address={data.tokenAddresses[0]} type="account" isCopy />
        </div>
      ) : null,
  },
]
