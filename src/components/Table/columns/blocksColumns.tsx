import Link from 'next/link'
import styles from '../Table.module.scss'
import { BlockModel, ChainConfigModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getNormalizedValue,
} from '@/lib/utils'

export const blocksColumns: (
  chainConfig: ChainConfigModel
) => IColumn<BlockModel>[] = (chainConfig) => [
  {
    accessor: 'number',
    title: 'Block',
    modifier: 'block-number',
    render: (data) => (
      <Address address={`${data.number}`} type="block" isCopy />
    ),
  },
  {
    accessor: 'timestamp',
    title: 'Age',
    type: 'center',
    modifier: 'block-ago',
    render: (data) => <TimeAgo timestamp={data.timestamp} />,
  },
  {
    accessor: 'transactionCount',
    title: 'TXs',
    tooltip: 'A total number of transactions found in the block.',
    type: 'center',
    modifier: 'block-txs',
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
    modifier: 'block-recipient',
    render: (data) => <Address type="account" address={data.miner} isCopy />,
  },
  {
    accessor: 'gasUsed',
    title: 'Gas Used',
    modifier: 'block-gasUsed',
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
    modifier: 'block-gasLimit',
    render: (data) => financialFormatLowValueHighPrecision(data.gasLimit || 0),
  },
  {
    accessor: 'baseFee',
    title: 'Base Fee',
    type: 'number',
    modifier: 'block-baseFee',
    render: (data) => (
      <Value
        value={getNormalizedValue(
          data.baseFeePerGas || 0,
          chainConfig.nativeCurrency.decimals - 9
        )}
        suffix={<>&nbsp;{chainConfig.gasUnit}</>}
      />
    ),
  },
]
