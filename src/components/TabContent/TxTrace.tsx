import { FC, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { isNull } from 'lodash'
import Loading from '../Loading'
import Trace from '../Trace'
import {
  TransactionModel,
  TransactionTraceModel,
} from '@/__generated__/resolvers-types'
import { Button, Card, Empty } from '@/components'
import { GET_TRANSACTION_TRACES } from '@/lib/apollo/queries'
import styles from './TxTrace.module.scss'

const TxTrace: FC<{ data: TransactionModel }> = ({ data }) => {
  const hash = data?.hash

  const [getTraces, { data: traceData, loading }] = useLazyQuery<{
    traces: TransactionTraceModel
  }>(GET_TRANSACTION_TRACES)

  useEffect(() => {
    getTraces({ variables: { hash } })
  }, [getTraces, hash])

  if (loading) {
    return (
      <Card>
        <Loading />
      </Card>
    )
  }

  const renderEmpty = () => <Empty title="This transaction left no trace" />
  const renderError = () => (
    <Empty
      className={styles.error}
      icon="🙀"
      title="Error while receiving trace info"
      subtitle={`for ${hash}`}
    >
      <Button className={styles.retry} caption="Retry?" onClick={getTraces} />
    </Empty>
  )

  console.log(traceData)

  if (isNull(traceData)) {
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
    return (
      <Empty
        className={styles.error}
        icon="🙀"
        title="Error while receiving trace info"
        subtitle={`for ${hash}`}
      >
        <Button className={styles.retry} caption="Retry?" onClick={getTraces} />
      </Empty>
    )
  }

  if (!tracesObj) {
    return renderEmpty()
  }

  return (
    <Card>
      <Trace data={tracesObj} />
    </Card>
  )
}

export default TxTrace
