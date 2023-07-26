import { DecodedInputModel } from '@/__generated__/resolvers-types'
import Code from '@/components/Code'
import { IColumn } from '@/components/Table/types'
import styles from './LogsView.module.scss'

export const decodedLogsColumns: IColumn<DecodedInputModel>[] = [
  {
    accessor: 'name',
    title: 'Name',
    render: (data) => <span className={styles.name}>{data.name}</span>,
  },
  {
    accessor: 'type',
    title: 'Type',
    render: (data) => (
      <>
        <span className={styles.type}>{data.type}</span>{' '}
        {data.isIndexed && <span className={styles.indexed}>indexed</span>}
      </>
    ),
  },
  {
    accessor: 'value',
    title: 'Data',
    render: (data) => <Code>{data.value}</Code>,
  },
]
