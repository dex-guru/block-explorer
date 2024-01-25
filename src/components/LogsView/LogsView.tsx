import { FC } from 'react'

import { LogModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Code from '@/components/Code'
import Properties from '@/components/Properties'
import { Property } from '@/components/Properties/types'
import Table from '@/components/Table'

import { DecodedText } from './DecodedText'
import { Topics } from './Topics'
import { decodedLogsColumns } from './decodedLogsColumns'

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
      value: <Address address={log.address} type="account" isShorten={false} isCopy />,
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
