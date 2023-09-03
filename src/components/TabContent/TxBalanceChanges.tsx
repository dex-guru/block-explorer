import { FC, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import {
  ChainConfigModel,
  DecodedInputModel,
  LogModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Card from '@/components/Card'
import { IconEmpty } from '@/components/Icons'
import { LoadingCard } from '@/components/Loading'
import StateView from '@/components/StateView'
import Table from '@/components/Table'
import { balanceChangesColumns } from '@/components/Table/columns/balanceChangesColumns'
import { GET_TRANSACTION_LOGS } from '@/lib/apollo/queries'
import { arrayUniqueValues } from '@/lib/utils'
import styles from './TxBalanceChanges.module.scss'

type BalanceRow = {
  address: string
  token: string
  tokenId?: string
  change: BigNumber
  row: DecodedInputModel
}

type BalancesPerAddress = {
  address: string
  tokens: Array<string>
  tokenIds?: Array<string>
  balances: Array<BigNumber>
  rows: DecodedInputModel[]
}

const parseLogs = (logs: LogModel[]): BalanceRow[] => {
  const result: BalanceRow[] = []

  logs.forEach((log) => {
    if (!log.decodedInput) {
      return
    }

    const from = log.decodedInput.find(
      (row) => row.type === 'address' && ['from', 'sender'].includes(row.name)
    )?.value
    const to = log.decodedInput.find(
      (row) => row.type === 'address' && row.name === 'to'
    )?.value
    const token = log.address

    log.decodedInput
      .filter((row) => row.name === 'value' || row.name.startsWith('amount'))
      .forEach((row) => {
        const value = row.value
        const bigValue = new BigNumber(value || 0)

        result.push({
          address:
            (row.name === 'value' || row.name.endsWith('In') ? from : to) || '',
          change: bigValue.multipliedBy(-1),
          token,
          row,
        })
        result.push({
          address:
            (row.name === 'value' || row.name.endsWith('Out') ? to : from) ||
            '',
          change: bigValue,
          token,
          row,
        })
      })
  })

  return result.filter((row) => !!row.address)
}

const TxBalanceChanges: FC<{
  data: TransactionModel
  chainConfig: ChainConfigModel
}> = ({ data }) => {
  const hash = data?.hash

  const [getLogs, { data: logsData, loading }] = useLazyQuery<{
    logs: LogModel[]
  }>(GET_TRANSACTION_LOGS)

  useEffect(() => {
    getLogs({ variables: { hash } })
  }, [getLogs, hash])

  if (!hash || (!loading && !logsData?.logs?.length)) {
    return <StateView icon={<IconEmpty />} title="No TX logs was found" />
  }

  if (hash && loading) {
    return <LoadingCard />
  }

  const parsedArr = parseLogs(logsData?.logs || [])
  const addresses = arrayUniqueValues(parsedArr.map((row) => row.address))
  const tableData = addresses
    .map((address) => {
      const result: BalancesPerAddress = {
        address: address as string,
        tokens: [],
        tokenIds: [],
        balances: [],
        rows: [],
      }

      parsedArr
        .filter((row) => row.address === address)
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

  return (
    <Card>
      <Table
        data={tableData}
        columns={balanceChangesColumns}
        className={styles.table}
      />
    </Card>
  )
}

export default TxBalanceChanges
