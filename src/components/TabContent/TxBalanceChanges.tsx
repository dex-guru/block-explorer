import { FC, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { balanceChangesColumns } from '../Table/columns/balanceChangesColumns'
import {
  ChainConfigModel,
  ChainStatsModel,
  TransactionModel,
  TransactionTraceModel,
} from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import { IconNoData } from '@/components/Icons'
import { LoadingCard } from '@/components/Loading'
import StateView from '@/components/StateView'
import Table from '@/components/Table'
import { GET_TRANSACTION_TRACES } from '@/lib/apollo/queries'
import styles from './TxTrace.module.scss'

const TxBalanceChanges: FC<{
  data: TransactionModel
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
}> = ({ data, chainConfig, chainStats }) => {
  const hash = data?.hash

  const [getTraces, { data: traceData, loading, called }] = useLazyQuery<{
    traces: TransactionTraceModel
  }>(GET_TRANSACTION_TRACES)

  useEffect(() => {
    getTraces({ variables: { hash } })
  }, [getTraces, hash])

  if (!called || loading) {
    return <LoadingCard />
  }

  const renderEmpty = () => <StateView title="This transaction left no trace" />
  const renderError = () => (
    <StateView
      icon={<IconNoData className={styles.icon} />}
      className={styles.error}
      title="Error while receiving trace info"
      subtitle={`for ${hash}`}
      actions={[
        {
          className: styles.retry,
          caption: 'Retry?',
          onClick: () => getTraces({ variables: { hash } }),
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
      <Table
        columns={balanceChangesColumns(chainConfig, chainStats)}
        data={[]}
      />
    </Card>
  )
}

export default TxBalanceChanges
