import dynamic from 'next/dynamic'

import { FC, useState } from 'react'

import { useQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'

import {
  ChainConfigModel,
  DecodedInputModel,
  InternalTransactionModel,
  LogModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import { IconEmpty } from '@/components/Icons'
import { LoadingCard } from '@/components/Loading'
import Table from '@/components/Table'
import { balanceChangesColumns } from '@/components/Table/columns/balanceChangesColumns'
import { GET_INTERNAL_TXS, GET_TRANSACTION_LOGS } from '@/lib/apollo/queries'

import Details from '../Details'
import TxBalanceChangesFlow from './TxBalanceChangesFlow'
import { useBalanceChanges } from './hooks'

import styles from './TxBalanceChanges.module.scss'

const StateView = dynamic(() => import('@/components/StateView'), {
  ssr: false,
})

type BalancesPerAddress = {
  address: string
  tokens: Array<string | null>
  tokenIds?: Array<string | null>
  balances: Array<BigNumber>
  rows: DecodedInputModel[]
}

const TxBalanceChanges: FC<{
  data: TransactionModel
  chainConfig: ChainConfigModel
}> = ({ data, chainConfig }) => {
  const hash = data?.hash

  const [isFlowWasOpen, setIsFlowWasOpen] = useState(false)

  const {
    data: logsData,
    loading: loadingLogs,
    called: calledLogs,
  } = useQuery<{
    logs: LogModel[]
  }>(GET_TRANSACTION_LOGS, { variables: { hash } })

  const {
    data: txsData,
    loading: loadingTxs,
    called: calledTxs,
  } = useQuery<{
    internalTransactions: { data: InternalTransactionModel[] }
  }>(GET_INTERNAL_TXS, { variables: { hash, first: 100000, skip: 0 } })

  const { flows, changes, addresses, tokens } = useBalanceChanges(
    logsData?.logs,
    txsData?.internalTransactions.data,
    data.fromAddress,
    data.toAddress
  )

  const isLoading = loadingLogs || loadingTxs
  const hasData = !!logsData?.logs?.length || !!txsData?.internalTransactions.data?.length

  if (!hash || (calledLogs && calledTxs && !isLoading && !hasData)) {
    return <StateView icon={<IconEmpty />} title="No TX logs was found" />
  }

  if (hash && (isLoading || !calledLogs || !calledTxs)) {
    return <LoadingCard />
  }

  if (!addresses?.length) {
    return <StateView icon={<IconEmpty />} title="No transfers was found" />
  }

  const tableData = addresses
    .map((address) => {
      const result: BalancesPerAddress = {
        address: address,
        tokens: [],
        tokenIds: [],
        balances: [],
        rows: [],
      }

      changes
        ?.filter((row) => row.address === address)
        .forEach((row) => {
          const tokenIdx = result.tokens.findIndex((token) => token === row.token)
          if (tokenIdx >= 0 && result.balances[tokenIdx]) {
            result.balances[tokenIdx] = result.balances[tokenIdx].plus(row.change)
          } else {
            result.tokens.push(row.token)
            result.balances.push(row.change)
            result.tokenIds?.push(row.tokenId || '')
          }
        })

      const zeroIdxs = result.balances
        .map((balance, idx) => (balance.isZero() ? idx : null))
        .filter((el) => el !== null)

      zeroIdxs.reverse().forEach((idx) => {
        result.balances = result.balances.filter((_, idx2) => idx2 !== idx)
        result.tokens = result.tokens.filter((_, idx2) => idx2 !== idx)
        result.tokenIds = result.tokenIds?.filter((_, idx2) => idx2 !== idx)
      })

      return result
    })
    .filter((row) => row.balances.length)

  const handleToggle = () => {
    setIsFlowWasOpen(true)
  }

  return (
    <Card>
      <Details title="Fund Flow" onToggle={handleToggle}>
        {isFlowWasOpen && (
          <TxBalanceChangesFlow
            addresses={addresses}
            balanceFlows={flows}
            chainConfig={chainConfig}
            tokens={tokens}
          />
        )}
      </Details>
      <Table
        data={tableData}
        columns={balanceChangesColumns(chainConfig, tokens, data.fromAddress, data.toAddress)}
        className={styles.table}
      />
    </Card>
  )
}

export default TxBalanceChanges
