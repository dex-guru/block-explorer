import Link from 'next/link'
import styles from '../Table.module.scss'
import { BlockModel } from '@/__generated__/resolvers-types'
import { Address, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getNormalizedValue,
} from '@/lib/utils'

export const blocksColumns: IColumn<BlockModel>[] = [
  {
    accessor: 'number',
    title: 'Block',
    render: (data) => <Address address={`${data.number}`} type="block" />,
  },
  {
    accessor: 'timestamp',
    title: 'Ago',
    type: 'center',
    render: (data) => <TimeAgo timestamp={data.timestamp} />,
  },
  {
    accessor: 'transactionCount',
    title: 'Txn',
    type: 'center',
    render: (data) => {
      if (!data.transactionCount) {
        return <span className={styles.muted}>0</span>
      }

      return (
        <Link href={`/txs?block=${data.number}`}>{data.transactionCount}</Link>
      )
    },
  },
  {
    accessor: 'feeRecipient',
    title: 'Fee Recipient',
    render: (data) => <Address type="account" address={data.miner} />,
  },
  {
    accessor: 'gasUsed',
    title: 'Gas Used',
    render: (data) => {
      if (!data.gasUsed || !data.gasLimit) {
        return <span className={styles.muted}>0</span>
      }

      return (
        <>
          {financialFormatLowValueHighPrecision(data.gasUsed || 0)}{' '}
          <span className={styles.muted}>
            {financialFormat(((data.gasUsed || 0) / data.gasLimit) * 100, {
              decimals: 2,
            })}
            %
          </span>
        </>
      )
    },
  },
  {
    accessor: 'gasLimit',
    title: 'Gas Limit',
    type: 'number',
    render: (data) => financialFormatLowValueHighPrecision(data.gasLimit || 0),
  },
  {
    accessor: 'baseFee',
    title: 'Base Fee',
    type: 'number',
    render: (data) => <>{getNormalizedValue(data.baseFeePerGas || 0)} Gwei</>,
  },
]
