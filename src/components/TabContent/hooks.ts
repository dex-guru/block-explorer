import { useQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'

import {
  InternalTransactionModel,
  LogModel,
  Maybe,
  TokenModel,
} from '@/__generated__/resolvers-types'
import { GET_TOKENS_INFO } from '@/lib/apollo/queries'
import { arrayUniqueValues } from '@/lib/utils'

type BalanceEntry = {
  token: string | null
  tokenId?: string
}

export type BalanceFlow = BalanceEntry & {
  from: string
  to: string
  amount: BigNumber
}

type BalanceRow = BalanceEntry & {
  address: string
  change: BigNumber
}

const getBalanceFlows = (
  logs?: LogModel[],
  internalTxs?: InternalTransactionModel[] | null
): [BalanceFlow[] | null, string[] | null] => {
  if (!(logs && internalTxs)) {
    return [null, null]
  }

  const result: BalanceFlow[] = []
  const addresses: string[] = []

  const sortedLogs = [...logs]?.sort((a, b) => a?.logIndex - b?.logIndex)

  sortedLogs?.forEach((log) => {
    const logName = log.eventName?.toLowerCase()
    const isImportantLog =
      logName?.startsWith('transfer') || ['withdrawal', 'deposit'].includes(logName || '')

    if (!isImportantLog || !log.decodedInput) {
      return
    }

    const isWithdrawal = logName === 'withdrawal'
    const isDeposit = logName === 'deposit'

    const from = isDeposit
      ? log.address
      : log.decodedInput.find(
          (row) =>
            row.type === 'address' &&
            (isWithdrawal ? log.address : ['from', 'sender'].includes(row.name))
        )?.value
    const to = isWithdrawal
      ? log.address
      : log.decodedInput.find(
          (row) =>
            row.type === 'address' && (isDeposit ? log.address : ['to', 'dst'].includes(row.name))
        )?.value
    const token = log.address

    if (from) {
      addresses.push(from)
    }
    if (to) {
      addresses.push(to)
    }
    if (token) {
      addresses.push(token)
    }

    log.decodedInput
      .filter((row) => ['value', 'wad'].includes(row.name) || row.name.startsWith('amount'))
      .forEach((row) => {
        const bigValue = new BigNumber(row.value || 0)
        if (bigValue.isZero()) {
          return
        }

        result.push({
          from: from || '',
          to: to || '',
          token,
          amount: bigValue,
        })
      })
  })

  internalTxs?.forEach((tx) => {
    if (!tx.value) {
      return
    }

    const bigValue = new BigNumber(tx.value || 0)

    result.push({
      from: tx.fromAddress,
      to: tx.toAddress,
      amount: bigValue,
      token: null,
    })
  })

  const addressesUsed = arrayUniqueValues<string>(addresses.filter((address) => !!address))

  return [result.filter((row) => !row.amount.isZero()), addressesUsed as string[]]
}

const getBalanceChangeRows = (balanceFlows: BalanceFlow[]): BalanceRow[] => {
  const result: BalanceRow[] = []

  balanceFlows?.forEach((flow) => {
    if (flow.amount.isZero()) {
      return
    }

    result.push({
      ...flow,
      address: flow.from,
      change: flow.amount.multipliedBy(-1),
    })

    result.push({
      ...flow,
      address: flow.to,
      change: flow.amount,
    })
  })

  return result.filter((row) => !!row.address)
}

export const useBalanceChanges = (
  logs?: LogModel[],
  internalTxs?: InternalTransactionModel[] | null,
  fromAddress?: Maybe<string>,
  toAddress?: Maybe<string>
) => {
  const [balanceFlows, addressesUsed] =
    logs && internalTxs ? getBalanceFlows(logs, internalTxs) : [null, null]
  const balanceChanges = balanceFlows ? getBalanceChangeRows(balanceFlows) : null
  const addresses = balanceChanges
    ? arrayUniqueValues<string>(balanceChanges?.map((row) => row.address)).sort((a) =>
        a === fromAddress ? -1 : a === toAddress ? 1 : 0
      )
    : null

  const { data: tokensData } = useQuery<{
    tokens: TokenModel[]
  }>(GET_TOKENS_INFO, { variables: { addresses: addressesUsed || [] } })

  return {
    flows: balanceFlows,
    changes: balanceChanges,
    addresses,
    tokens: tokensData?.tokens,
  }
}
