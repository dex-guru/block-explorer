import { FC, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { LoadingCard } from '../Loading'
import Trace from '../Trace'
import {
  ChainConfigModel,
  TransactionModel,
  TransactionTraceModel,
} from '@/__generated__/resolvers-types'
import { Card, Empty, Error } from '@/components'
import { CHAIN_ID } from '@/constants'
import { GET_TRANSACTION_TRACES } from '@/lib/apollo/queries'
import styles from './TxTrace.module.scss'

const TxTrace: FC<{
  data: TransactionModel
  chainConfig: ChainConfigModel
}> = ({ data, chainConfig }) => {
  const hash = data?.hash

  const [getTraces, { data: traceData, loading, called }] = useLazyQuery<{
    traces: TransactionTraceModel
  }>(GET_TRANSACTION_TRACES)

  useEffect(() => {
    getTraces({ variables: { hash, chainId: CHAIN_ID } })
  }, [getTraces, hash])

  if (!called || loading) {
    return <LoadingCard />
  }

  const renderEmpty = () => <Empty title="This transaction left no trace" />
  const renderError = () => (
    <Error
      className={styles.error}
      title="Error while receiving trace info"
      subtitle={`for ${hash}`}
      actions={[
        {
          className: styles.retry,
          caption: 'Retry?',
          onClick: () => getTraces({ variables: { hash, chainId: CHAIN_ID } }),
        },
      ]}
    />
  )

  if (called && !traceData) {
    return renderError()
  }

  if (!traceData?.traces?.tracesJSON) {
    return renderEmpty()
  }

  let tracesObj = null

  try {
    tracesObj = JSON.parse(traceData?.traces?.tracesJSON)
  } catch (e) {
    console.error(e)
    renderError()
  }

  if (!tracesObj) {
    return renderEmpty()
  }

  return (
    <Card>
      <Trace data={tracesObj} chainConfig={chainConfig} />
    </Card>
  )
}

export default TxTrace
