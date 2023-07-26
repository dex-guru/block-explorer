import { FC, useEffect, useState } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useLazyQuery } from '@apollo/client'
import {
  ChainConfigModel,
  TransactionModel,
  TransactionTraceModel,
} from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import { IconNoData } from '@/components/Icons'
import { LoadingCard } from '@/components/Loading'
import StateView from '@/components/StateView'
import TabPanel from '@/components/TabPanel'
import Trace from '@/components/Trace'
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

  const [currentTab, setCurrentTab] = useState('formatted')

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
      <TabPanel
        className={styles.container}
        tabsClassName={styles.tabs}
        tabs={[
          {
            title: 'Formatted',
            value: 'formatted',
            onClick: () => {
              setCurrentTab('formatted')
            },
            content: <Trace data={tracesObj} chainConfig={chainConfig} />,
          },
          {
            title: 'JSON',
            value: 'json',
            onClick: () => {
              setCurrentTab('json')
            },
            content: (
              <SyntaxHighlighter
                className={styles.code}
                language="json"
                wrapLongLines
                showLineNumbers
                useInlineStyles={false}
              >
                {JSON.stringify(tracesObj, null, 4)}
              </SyntaxHighlighter>
            ),
          },
        ]}
        value={currentTab}
      />
    </Card>
  )
}

export default TxTrace
