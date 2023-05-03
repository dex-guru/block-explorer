import { FC, ReactNode } from 'react'
import { Property } from '../Properties/types'
import { decodedLogsColumns } from '../Table/columns/decodedLogsColumns'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Properties, Table } from '@/components'
import styles from './TxLogs.module.scss'

const getDecodedText = ({ eventName, decodedInput }: LogModel): ReactNode => {
  if (!eventName || !decodedInput) {
    return null
  }

  const args = decodedInput.map((el, idx) => (
    <>
      <span className={styles.type}>{el.type}</span>{' '}
      {el.isIndexed && <span className={styles.indexed}>indexed</span>}{' '}
      <span className={styles.name}>{el.name}</span>
      {idx < decodedInput.length - 1 && ', '}
    </>
  ))

  return (
    <div className={styles.code}>
      <span className={styles.method}>{eventName}</span>
      <span className={styles.args}>({args})</span>
    </div>
  )
}

const TxLogs: FC<{ data: TransactionModel; logs: LogModel[] | null }> = ({
  logs,
}) => {
  const renderLogs = () => {
    return logs?.map((log) => {
      const decodedProperty: Property[] = log.decodedInput
        ? [
            {
              title: 'Decoded',
              value: (
                <>
                  {getDecodedText(log)}

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
      ]

      return <Properties key={log.logIndex} data={properties} />
    })
  }

  return <>{renderLogs()}</>
}

export default TxLogs
