import BigNumber from 'bignumber.js'
import {
  InternalTransactionModel,
  LogModel,
} from '@/__generated__/resolvers-types'

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

export const useBalanceFlows = (
  logs?: LogModel[],
  internalTxs?: InternalTransactionModel[] | null
): BalanceFlow[] | null => {
  if (!(logs && internalTxs)) {
    return null
  }

  const result: BalanceFlow[] = []

  logs
    .sort((a, b) => a.logIndex - b.logIndex)
    .forEach((log) => {
      const logName = log.eventName?.toLowerCase()
      const isImportantLog =
        logName?.startsWith('transfer') ||
        ['withdrawal', 'deposit'].includes(logName || '')

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
              (isWithdrawal
                ? log.address
                : ['from', 'sender'].includes(row.name))
          )?.value
      const to = isWithdrawal
        ? log.address
        : log.decodedInput.find(
            (row) =>
              row.type === 'address' &&
              (isDeposit ? log.address : ['to', 'dst'].includes(row.name))
          )?.value
      const token = log.address

      log.decodedInput
        .filter(
          (row) =>
            ['value', 'wad'].includes(row.name) || row.name.startsWith('amount')
        )
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

  internalTxs.forEach((tx) => {
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

  return result.filter((row) => !row.amount.isZero())
}

export const useBalanceChanges = (
  balanceFlows: BalanceFlow[] | null
): BalanceRow[] => {
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
