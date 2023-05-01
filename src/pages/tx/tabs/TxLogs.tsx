import { FC } from 'react'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Properties } from '@/components'

const TxLogs: FC<{ data: TransactionModel; logs: LogModel[] | null }> = ({
  logs,
}) => {
  return (
    <>
      {logs?.map((log) => {
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
      })}
    </>
  )
}

export default TxLogs
