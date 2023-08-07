import BigNumber from 'bignumber.js'
import { Label } from 'recharts'
import styles from '../Table.module.scss'
import {
  ChainConfigModel,
  ChainStatsModel,
  InternalTransactionModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import { getNormalizedValue } from '@/lib/utils'

export const internalTxsColumns: (
  chainConfig: ChainConfigModel,
  chainStats: ChainStatsModel
) => IColumn<InternalTransactionModel>[] = (chainConfig, chainStats) => [
  {
    accessor: 'blockNumber',
    title: 'Block',
    render: (data) => (
      <Address address={`${data.blockNumber}`} type="block" isCopy />
    ),
  },
  {
    accessor: 'blockTimestamp',
    title: 'Age',
    type: 'center',
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
  },
  {
    accessor: 'Parent Txn Hash',
    title: 'Age',
    render: (data) => <Address address={data.hash} type="tx" isCopy />,
  },
  {
    accessor: 'type',
    title: 'Method',
    type: 'center',
    render: (data) => <Label>{data.type}</Label>,
  },
  {
    accessor: 'fromAddress',
    title: 'Out',
    render: (data) => (
      <Address type="account" address={data.fromAddress} isCopy />
    ),
  },
  {
    accessor: 'toAddress',
    title: 'In',
    render: (data) => (
      <Address type="account" address={data.toAddress} isCopy />
    ),
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
              value={getNormalizedValue(
                bigValue,
                chainConfig?.nativeCurrency.decimals
              )}
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
                bigValue.multipliedBy(
                  Number(chainStats?.nativeTokenPriceUsd || 0)
                ),
                chainConfig?.nativeCurrency.decimals,
                { decimals: 2 }
              )}
            />
          }
        />
      )
    },
  },
]
