import BigNumber from 'bignumber.js'

import { TransactionModel } from '@/__generated__/resolvers-types'
import { ChainConfigModel, ChainStatsModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import Tile from '@/components/Tile'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import { getNormalizedValue } from '@/lib/utils'

import styles from '../Table.module.scss'

export const txsColumns = (
  chainConfig?: ChainConfigModel,
  chainStats?: ChainStatsModel
): IColumn<TransactionModel>[] => [
  {
    accessor: 'hash',
    title: 'TX Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" isCopy />,
  },
  {
    accessor: 'blockNumber',
    title: 'Block',
    modifier: 'address',
    render: (data) => <Address address={`${data.blockNumber}`} type="block" isCopy />,
  },
  {
    accessor: 'blockTimestamp',
    title: 'Age',
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
  },
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) =>
      data.fromAddress ? <Address address={data.fromAddress} type="account" isCopy /> : null,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? <Address address={data.toAddress} type="account" isCopy /> : null,
  },
  {
    accessor: 'value',
    title: 'Value',
    type: 'number',
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
]
