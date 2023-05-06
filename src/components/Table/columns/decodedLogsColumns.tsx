import { DecodedInputModel } from '@/__generated__/resolvers-types'
import Code from '@/components/Code'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'

export const decodedLogsColumns: IColumn<DecodedInputModel>[] = [
  {
    accessor: 'name',
    title: 'Name',
    render: (data) => data.name,
  },
  {
    accessor: 'type',
    title: 'Type',
    render: (data) => data.type,
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
    render: (data) => {
      const isAmount = data.name === 'amount'

      const format = isAmount
        ? {
            dec: true,
            decode: (value: string) => {
              return getNormalizedValue(value)
            },
          }
        : undefined

      return (
        <Code defaultFormat={isAmount ? 'dec' : 'ascii'} isCopy format={format}>
          {data.value}
        </Code>
      )
    },
  },
]
