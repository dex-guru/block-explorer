import { FC } from 'react'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Empty, Properties } from '@/components'
import IconEmpty from '@/images/icons/no-flash.svg'

const TxLogs: FC<{ data: TransactionModel; logs: LogModel[] | null }> = ({
  logs,
}) => {
  if (!logs?.length) {
    return <Empty icon={<IconEmpty />} title="No logs was found" />
  }

  const renderedLogs = logs.map((log) => renderLog(log))

  return <>{renderedLogs}</>
}

const renderLog = (log: LogModel) => {
  return (
    <Properties
      key={log.logIndex}
      data={[
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
        {
          title: 'Block Number',
          value: <Address address={`${log.blockNumber}`} type="block" />,
        },
        {
          title: 'Topics',
          value: log.topics?.length ? (
            <div className="text">
              <ul>
                {log.topics.map((topic, tIdx) => (
                  <li key={tIdx}>
                    [{tIdx}]{' '}
                    <Address
                      type="account"
                      address={topic}
                      isLink={false}
                      isShorten={false}
                      isCopy
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        },
        {
          title: 'Data',
          value: log.data,
        },
        {
          title: 'Log Index',
          value: `${log.logIndex}`,
        },
      ]}
    />
  )
}

export default TxLogs
