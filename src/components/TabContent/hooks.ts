import BigNumber from 'bignumber.js'
import {
  InternalTransactionModel,
  LogModel,
} from '@/__generated__/resolvers-types'

type BalanceRow = {
  address: string
  token: string | null
  tokenId?: string
  change: BigNumber
}

export const useBalanceChange = (
  logs?: LogModel[],
  internalTxs?: InternalTransactionModel[] | null
): BalanceRow[] | null => {
  if (!(logs && internalTxs)) {
    return null
  }

  const result: BalanceRow[] = []

  logs
    .sort((a, b) => a.logIndex - b.logIndex)
    .forEach((log) => {
      if (!log.eventName?.startsWith('Transfer') || !log.decodedInput) {
        return
      }

      const from = log.decodedInput.find(
        (row) =>
          row.type === 'address' && ['from', 'sender', 'src'].includes(row.name)
      )?.value
      const to = log.decodedInput.find(
        (row) => row.type === 'address' && ['to', 'dst'].includes(row.name)
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
            address: from || '',
            change: bigValue.multipliedBy(-1),
            token,
          })
          result.push({
            address: to || '',
            change: bigValue,
            token,
          })
        })
    })

  internalTxs.forEach((tx) => {
    if (!tx.value) {
      return
    }

    const bigValue = new BigNumber(tx.value || 0)

    result.push({
      address: tx.fromAddress,
      change: bigValue.multipliedBy(-1),
      token: null,
    })
    result.push({
      address: tx.toAddress,
      change: bigValue,
      token: null,
    })
  })

  return result.filter((row) => !!row.address)
}
