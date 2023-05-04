import { FC, ReactNode, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import Loading from '../Loading'
import { Property } from '../Properties/types'
import { decodedLogsColumns } from '../Table/columns/decodedLogsColumns'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { Address, Card, Empty, Properties, Table } from '@/components'
import IconEmpty from '@/images/icons/no-flash.svg'
import { GET_TRANSACTION_LOGS } from '@/lib/apollo/queries'
import styles from './TxLogs.module.scss'

const getDecodedText = ({ eventName, decodedInput }: LogModel): ReactNode => {
  if (!eventName || !decodedInput) {
    return null
  }

  const args = decodedInput.map((el, idx) => (
    <span className={styles.arg} key={idx}>
      <span className={styles.type}>{el.type}</span>{' '}
      {el.isIndexed && <span className={styles.indexed}>indexed</span>}{' '}
      <span className={styles.name}>{el.name}</span>
      {idx < decodedInput.length - 1 && ', '}
    </span>
  ))

  return (
    <div className={styles.code}>
      <span className={styles.method}>{eventName}</span>
      <span className={styles.args}>({args})</span>
    </div>
  )
}

const TxLogs: FC<{ data: TransactionModel }> = (props) => {
  const hash = props.data?.hash

  const [getLogs, { data, loading }] = useLazyQuery<{ logs: LogModel[] }>(
    GET_TRANSACTION_LOGS
  )

  useEffect(() => {
    getLogs({ variables: { hash } })
  }, [getLogs, hash])

  if (!hash || (!loading && !data?.logs?.length)) {
    return <Empty icon={<IconEmpty />} title="No TX logs was found" />
  }

  if (hash && loading) {
    return (
      <Card>
        <Loading />
      </Card>
    )
  }

  const renderLogs = () => {
    return data?.logs?.map((log) => {
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
