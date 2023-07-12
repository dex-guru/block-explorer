import clsx from 'clsx'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, Label, TimeAgo, Value } from '@/components'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
} from '@/lib/utils'
import styles from './DexTradesDataTable.module.scss'

export const dexTradesColumns = (
  address: string
): IColumn<Erc20EventModel>[] => [
  {
    accessor: 'eventType',
    title: 'Action',
    render: (data) => {
      const eventType =
        data.eventType === 'swap'
          ? data.tokenAddresses[0] === address
            ? 'sell'
            : 'buy'
          : data.eventType

      return (
        <Label className={clsx(styles.tag, styles[eventType])}>
          {eventType}
        </Label>
      )
    },
  },
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" isCopy />,
  },
  {
    accessor: 'blockTimestamp',
    title: 'Age',
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
  },
  {
    accessor: 'amounts',
    title: 'Quantity Out',
    type: 'number',
    modifier: 'tokenAmount',
    render: (data) => {
      if (data.eventType === 'swap') {
        return (
          <div>
            {financialFormatLowValueHighPrecision(data.amounts[0], {
              highPrecession: true,
            })}
          </div>
        )
      }

      if (data.eventType === 'burn') {
        return null
      }

      return (
        <div className={styles.data}>
          {data.tokenAddresses?.map((addr, idx) => {
            return (
              <div className={styles.dataRow} key={idx}>
                <div className={styles.dataNumber}>
                  {financialFormatLowValueHighPrecision(data.amounts[idx], {
                    highPrecession: true,
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )
    },
  },
  {
    accessor: 'tokenSymbols',
    modifier: 'tokenSymbol',
    render: (data) => {
      if (data.eventType === 'swap') {
        return (
          <Token
            address={data.tokenAddresses[0]}
            name={data.tokenNames[0]}
            symbol={data.tokenSymbols[0]}
            logo={data.tokenLogos[0]}
          />
        )
      }

      if (data.eventType === 'burn') {
        return (
          <>
            LP{' '}
            <span className={styles.muted}>{data.tokenSymbols.join('/')}</span>
          </>
        )
      }

      return (
        <div className={styles.data}>
          {data.tokenAddresses?.map((addr, idx) => {
            return (
              <div className={styles.dataRow} key={idx}>
                <Token
                  address={data.tokenAddresses[idx]}
                  name={data.tokenNames[idx]}
                  symbol={data.tokenSymbols[idx]}
                  logo={data.tokenLogos[idx]}
                />
              </div>
            )
          })}
        </div>
      )
    },
  },
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) =>
      data.fromAddress ? (
        <Address address={data.fromAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'amounts',
    title: 'Quantity In',
    type: 'number',
    modifier: 'tokenAmount',
    render: (data) => {
      if (data.eventType === 'swap') {
        return financialFormatLowValueHighPrecision(data.amounts[1], {
          highPrecession: true,
        })
      }

      if (data.eventType === 'mint') {
        return null
      }

      return (
        <div className={styles.data}>
          {data.tokenAddresses?.map((addr, idx) => {
            return (
              <div className={styles.dataRow} key={idx}>
                <div className={styles.dataNumber}>
                  {financialFormatLowValueHighPrecision(data.amounts[idx], {
                    highPrecession: true,
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )
    },
  },
  {
    accessor: 'tokenSymbols',
    modifier: 'tokenSymbol',
    render: (data) => {
      if (data.eventType === 'swap') {
        return (
          <Token
            address={data.tokenAddresses[1]}
            name={data.tokenNames[1]}
            symbol={data.tokenSymbols[1]}
            logo={data.tokenLogos[1]}
          />
        )
      }

      if (data.eventType === 'mint') {
        return (
          <>
            LP{' '}
            <span className={styles.muted}>{data.tokenSymbols.join('/')}</span>
          </>
        )
      }

      return (
        <div className={styles.data}>
          {data.tokenAddresses?.map((addr, idx) => {
            return (
              <div className={styles.dataRow} key={idx}>
                <Token
                  address={data.tokenAddresses[idx]}
                  name={data.tokenNames[idx]}
                  symbol={data.tokenSymbols[idx]}
                  logo={data.tokenLogos[idx]}
                />
              </div>
            )
          })}
        </div>
      )
    },
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.toAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'prices',
    title: 'Token Price',
    type: 'number',
    render: (data) => (
      <Value prefix="$" value={financialFormat(data.prices[1])} />
    ),
  },
]
