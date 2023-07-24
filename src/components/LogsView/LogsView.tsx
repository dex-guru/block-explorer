import { FC } from 'react'
import { DecodedText } from './DecodedText'
import { Topics } from './Topics'
import { decodedLogsColumns } from './decodedLogsColumns'
import { LogModel } from '@/__generated__/resolvers-types'
import { Address, Code, Properties, Table } from '@/components'
import { Property } from '@/components/Properties/types'

interface ILogsViewProps {
  log: LogModel
}

export const LogsView: FC<ILogsViewProps> = ({ log }) => {
  const decodedProperty: Property[] = log.decodedInput
    ? [
        {
          title: 'Decoded',
          value: (
            <>
              <DecodedText data={log} />
              <Table columns={decodedLogsColumns} data={log.decodedInput} />
            </>
          ),
        },
      ]
    : []

  const properties = [
    {
      title: 'Address',
      value: (
        <Address
          address={log.address}
          type="account"
          isShorten={false}
          isCopy
        />
      ),
    },
    ...decodedProperty,
    {
      title: 'Topics',
      value: <Topics topics={log.topics} />,
    },
    {
      title: 'Data',
      value: <Code>{log.data}</Code>,
    },
    {
      title: 'Log Index',
      value: `${log.logIndex}`,
    },
  ]
  return <Properties data={properties} />
}
