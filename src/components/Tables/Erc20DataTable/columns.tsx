import clsx from 'clsx'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, Label, TimeAgo } from '@/components'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import TooltipAnchor from '@/components/TooltipAnchor'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from './Erc20DataTable.module.scss'

export const erc20Columns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => (
      <div className={styles.data}>
        <div className={styles.dataRow}>
          <Address address={data.hash} type="tx" isCopy />
        </div>
      </div>
    ),
  },
  {
    accessor: 'eventType',
    title: 'Method',
    modifier: 'address',
    render: (data) => (
      <Label className={clsx(styles.tag, styles[data.eventType])}>
        {data.eventType}
      </Label>
    ),
  },
  {
    accessor: 'blockTimestamp',
    title: 'Age',
    render: (data) => (
      <div className={styles.data}>
        <div className={styles.dataRow}>
          <TimeAgo timestamp={data.blockTimestamp} />
        </div>
      </div>
    ),
  },
  {
    accessor: 'fromAddress',
    title: (
      <>
        Out{' '}
        <TooltipAnchor tooltip="The address where the token(s) were sent from." />
      </>
    ),
    modifier: 'address',
    render: (data) =>
      data.fromAddress ? (
        <div className={styles.data}>
          <div className={styles.dataRow}>
            <Address address={data.fromAddress} type="account" isCopy />
          </div>
        </div>
      ) : null,
  },
  {
    accessor: 'toAddress',
    title: (
      <>
        In <TooltipAnchor tooltip="The address that received the token(s)." />
      </>
    ),
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <div className={styles.data}>
          <div className={styles.dataRow}>
            <Address address={data.toAddress} type="account" isCopy />
          </div>
        </div>
      ) : null,
  },
  {
    accessor: 'amounts',
    title: 'Quantity',
    type: 'number',
    modifier: 'tokenAmount',
    render: (data) => {
      if (!data.toAddress) {
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
    accessor: 'tokenAddresses',
    title: 'Token',
    modifier: 'tokenSymbol',
    render: (data) => {
      if (!data.toAddress) {
        return null
      }

      return (
        <div className={styles.data}>
          {data.tokenAddresses?.map((addr, idx) => {
            return (
              <div className={styles.dataRow} key={idx}>
                <Token
                  address={addr}
                  name={data.tokenNames[idx]}
                  logo={data.tokenLogos[idx]}
                  symbol={data.tokenSymbols[idx]}
                />
              </div>
            )
          })}
        </div>
      )
    },
  },
]
