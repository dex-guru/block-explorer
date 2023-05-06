import Code from '../Code'
import { DecodedInputModel } from '@/__generated__/resolvers-types'
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
    render: (data) => <span className={styles.type}>{data.type}</span>,
  },
  {
    accessor: 'isIndexed',
    title: 'Indexed?',
    type: 'center',
    render: (data) => (data.isIndexed ? 'true' : 'false'),
  },
  {
    accessor: 'value',
    title: 'Data',
    render: (data) => <Code>{data.value}</Code>,
  },
]
