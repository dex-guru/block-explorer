import { FC } from 'react'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Card, Properties } from '@/components'

const TxLogs: FC<{ data: TransactionModel; logs: LogModel[] | null }> = ({
  data,
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
                  />
                ),
              },
              {
                title: 'Block Number',
                value: <Address address={`${log.blockNumber}`} type="block" />,
              },
              {
                title: 'Topics',
                value: (
                  <>
                    {!!log.topics?.length && (
                      <ul>
                        {log.topics.map((topic, tIdx) => (
                          <li key={tIdx}>
                            [{tIdx}] {topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ),
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
