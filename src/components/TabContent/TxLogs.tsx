import { FC, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { LoadingCard } from '../Loading'
import { LogsView } from '../LogsView'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { Empty } from '@/components'
import IconEmpty from '@/images/icons/no-flash.svg'
import { GET_TRANSACTION_LOGS } from '@/lib/apollo/queries'

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
    return <LoadingCard />
  }

  const renderLogs = () => {
    return data?.logs?.map((log) => <LogsView key={log.data} log={log} />)
  }

  return <>{renderLogs()}</>
}

export default TxLogs
