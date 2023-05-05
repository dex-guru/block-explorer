import { FC, Fragment, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import Loading from '../Loading'
import {
  TransactionModel,
  TransactionTraceModel,
} from '@/__generated__/resolvers-types'
import { Address, Card, Details, Empty, Value } from '@/components'
import { GET_TRANSACTION_TRACES } from '@/lib/apollo/queries'

type Trace = {
  from: string
  gas: string
  gasUsed: string
  input: string
  output: string
  to: string
  type: string
  value: string
  calls?: Trace[]
}

const renderTrace = (trace: Trace) => {
  const content = (
    <div>
      From <Address address={trace.from} type="account" />
      To <Address address={trace.to} type="account" />
      <Value value={trace.value} />
    </div>
  )

  if (trace.calls?.length) {
    return (
      <Details title={content}>
        {trace.calls.map((item, idx) => (
          <Fragment key={idx}>{renderTrace(item)}</Fragment>
        ))}
      </Details>
    )
  }

  return content
}

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

  const empty = <Empty title="This transaction left to traces" />

  if (!traceData?.traces?.tracesJSON) {
    return empty
  }

  let tracesObj = null

  try {
    tracesObj = JSON.parse(traceData?.traces?.tracesJSON)
  } catch (e) {
    console.error(e)
  }

  if (!tracesObj) {
    return empty
  }

  return <Card>{renderTrace(tracesObj)}</Card>
}

export default TxTrace
