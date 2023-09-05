import { FC, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useLazyQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import { AddressValues } from '../Address/helpers'
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
import { arrayUniqueValues, getNormalizedValue } from '@/lib/utils'
import styles from './TxBalanceChanges.module.scss'

const Graph = dynamic(() => import('@/components/Graph'), { ssr: false })
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
    balanceChanges?.map((row) => row.address) || []
  )

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

  const graphTextLines = ['graph LR']

  addresses.forEach((address) => {
    const from = `address_${address}`
    graphTextLines.push(
      `${from}("<a href='${AddressValues.account.url(
        `${address}`
      )}'>${AddressValues.account
        .format(`${address}`)
        .replace('…', '...')}</a>")`
    )
  })

  addresses.forEach((address) => {
    const from = `address_${address}`
    balanceFlows
      ?.filter((row) => row.from === address)
      .forEach((row) => {
        const to = `address_${row.to}`
        graphTextLines.push(
          `${from}-- "${getNormalizedValue(row.amount, 18, {
            highPrecession: true,
          })} ${
            row.token
              ? `<a href='${AddressValues.token.url(
                  row.token
                )}'>${AddressValues.token
                  .format(row.token)
                  .replace('…', '...')}</a>`
              : chainConfig.nativeCurrency.name
          }" -->${to}`
        )
      })
  })

  return (
    <Card>
      <Graph data={graphTextLines.join('\r\n\t')} />
      <Table
        data={tableData}
        columns={balanceChangesColumns(chainConfig)}
        className={styles.table}
      />
    </Card>
  )
}

export default TxBalanceChanges
