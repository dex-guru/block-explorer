import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from '../Table.module.scss'
import { BlockModel } from '@/__generated__/resolvers-types'
import { Address } from '@/components'
import { IColumn } from '@/components/Table/types'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'

const TimeAgo = dynamic(() => import('../../TimeAgo/TimeAgo'), { ssr: false })

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
    accessor: 'gasUsed',
    title: 'Gas Used',
    render: (data) => financialFormatLowValueHighPrecision(data.gasUsed || 0),
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
    render: (data) =>
      financialFormatLowValueHighPrecision(data.baseFeePerGas || 0),
  },
]
