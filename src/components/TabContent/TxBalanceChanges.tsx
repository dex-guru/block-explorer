import { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import Details from '../Details'
import TxBalanceChangesFlow from './TxBalanceChangesFlow'
import { useBalanceChanges, useBalanceFlows } from './hooks'
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
import { arrayUniqueValues } from '@/lib/utils'
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

  const [
    getLogs,
    { data: logsData, loading: loadingLogs, called: calledLogs },
  ] = useLazyQuery<{
    logs: LogModel[]
  }>(GET_TRANSACTION_LOGS)

  const [
    getInternalTxs,
    { data: txsData, loading: loadingTxs, called: calledTxs },
  ] = useLazyQuery<{
    internalTransactions: { data: InternalTransactionModel[] }
  }>(GET_INTERNAL_TXS)

  useEffect(() => {
    getLogs({ variables: { hash } })
    getInternalTxs({ variables: { hash, first: 1000, skip: 0 } })
  }, [getLogs, getInternalTxs, hash])

  const balanceFlows = useBalanceFlows(
    logsData?.logs,
    txsData?.internalTransactions.data
  )

  const balanceChanges = useBalanceChanges(balanceFlows)

  const isLoading = loadingLogs || loadingTxs
  const hasData =
    logsData?.logs?.length || !txsData?.internalTransactions.data?.length

  if (!hash || (calledLogs && calledTxs && !isLoading && !hasData)) {
    return <StateView icon={<IconEmpty />} title="No TX logs was found" />
  }

  if (hash && (isLoading || !calledLogs || !calledTxs)) {
    return <LoadingCard />
  }

  const addresses = arrayUniqueValues(
    balanceChanges?.map((row) => row.address)
  ) as string[]

  if (!addresses.length) {
    return <StateView icon={<IconEmpty />} title="No transfers was found" />
  }

  const tableData = addresses
    .map((address) => {
      const result: BalancesPerAddress = {
        address: address as string,
        tokens: [],
        tokenIds: [],
        balances: [],
        rows: [],
      }

      balanceChanges
        ?.filter((row) => row.address === address)
        .forEach((row) => {
          const tokenIdx = result.tokens.findIndex(
            (token) => token === row.token
          )
          if (tokenIdx >= 0 && result.balances[tokenIdx]) {
            result.balances[tokenIdx] = result.balances[tokenIdx].plus(
              row.change
            )
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
            balanceFlows={balanceFlows}
            chainConfig={chainConfig}
          />
        )}
      </Details>
      <Table
        data={tableData}
        columns={balanceChangesColumns(chainConfig)}
        className={styles.table}
      />
    </Card>
  )
}

export default TxBalanceChanges
