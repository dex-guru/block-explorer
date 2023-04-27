import dayjs from 'dayjs'
import { TransactionModel } from '@/__generated__/resolvers-types'
import { Button } from '@/components'
import { IColumn } from '@/components/Table/types'
import styles from './txnColumns.module.scss'

export const columns: IColumn<TransactionModel>[] = [
  {
    accessor: 'hash',
    header: 'txHash',
    render: (data) => (
      <Button className={styles.link} to={`/tx/${data.hash}`}>
        {data.hash}
      </Button>
    ),
  },
  {
    accessor: 'blockHash',
    header: 'block',
  },
  {
    accessor: 'blockTimestamp',
    header: 'age',
    render: (data) => {
      const age = dayjs(new Date(data.blockTimestamp * 1000))
      const now = dayjs()
      return `${now.diff(age, 'minute')} min ago`
    },
  },
  {
    accessor: 'fromAddress',
    header: 'from',
  },
  {
    accessor: 'toAddress',
    header: 'to',
  },
  {
    accessor: 'value',
    header: 'value',
  },
  {
    accessor: 'blockHash',
    header: 'block',
  },
]
