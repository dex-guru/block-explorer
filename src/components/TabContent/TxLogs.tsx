import { FC, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { LogModel, TransactionModel } from '@/__generated__/resolvers-types'
import { IconNoData } from '@/components/Icons'
import { LoadingCard } from '@/components/Loading'
import LogsView from '@/components/LogsView'
import StateView from '@/components/StateView'
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
    return <StateView icon={<IconNoData />} title="No TX logs was found" />
  }

  if (hash && loading) {
    return <LoadingCard />
  }

  const renderLogs = () => {
    return data?.logs?.map((log, idx) => <LogsView key={idx} log={log} />)
  }

  return <>{renderLogs()}</>
}

export default TxLogs
