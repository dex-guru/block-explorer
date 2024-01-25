import BigNumber from 'bignumber.js'

import {
  ChainConfigModel,
  ChainStatsModel,
  InternalTransactionModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Label from '@/components/Label'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import { financialFormat, getNormalizedValue } from '@/lib/utils'

import styles from '../Table.module.scss'

export const internalTxsColumns: (
  chainConfig: ChainConfigModel,
  chainStats: ChainStatsModel,
  inner?: boolean
) => IColumn<InternalTransactionModel>[] = (chainConfig, chainStats, inner = false) => {
  const parentTxCols: IColumn<InternalTransactionModel>[] = inner
    ? []
    : [
        {
          accessor: 'blockNumber',
          title: 'Block',
          render: (data) => <Address address={`${data.blockNumber}`} type="block" isCopy />,
        },
        {
          accessor: 'blockTimestamp',
          title: 'Age',
          type: 'center',
          render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
        },
        {
          accessor: 'hash',
          title: 'Parent Txn Hash',
          render: (data) => <Address address={data.hash} type="tx" isCopy />,
        },
      ]

  return [
    ...parentTxCols,
    {
      accessor: 'type',
      title: 'Method',
      render: (data) => <Label className={styles.labelType}>{data.type}</Label>,
    },
    {
      accessor: 'fromAddress',
      title: 'Address Out',
      render: (data) => <Address type="account" address={data.fromAddress} isCopy />,
    },
    {
      accessor: 'toAddress',
      title: 'Address In',
      render: (data) => <Address type="account" address={data.toAddress} isCopy />,
    },
    {
      accessor: 'value',
      title: 'Value',
      type: 'number',
      modifier: 'block-baseFee',
      render: (data) => {
        const value = Number(data.value)
        const bigValue = new BigNumber(value)

        return (
          <Tile
            className={styles.valueNativeWithStable}
            title={
              <Value
                value={getNormalizedValue(bigValue, chainConfig?.nativeCurrency.decimals)}
                suffix={
                  chainConfig?.nativeCurrency.symbol ? (
                    <>&nbsp;{chainConfig?.nativeCurrency.symbol}</>
                  ) : undefined
                }
              />
            }
            postfix={
              <Value
                prefix="$"
                value={getNormalizedValue(
                  bigValue.multipliedBy(Number(chainStats?.nativeTokenPriceUsd || 0)),
                  chainConfig?.nativeCurrency.decimals,
                  { decimals: 2 }
                )}
              />
            }
          />
        )
      },
    },
    {
      accessor: 'gasLimit',
      title: 'Gas Limit',
      type: 'number',
      render: (data) => financialFormat(data.gasLimit || 0),
    },
  ]
}
