import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, IconQuestion, Label, TimeAgo } from '@/components'
import { AddressValues } from '@/components/Address/helpers'
import { IColumn } from '@/components/Table/types'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from './Erc20DataTable.module.scss'

export const erc20Columns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'hash',
    title: 'Txn Hash',
    modifier: 'address',
    render: (data) => <Address address={data.hash} type="tx" isCopy />,
  },
  {
    accessor: 'eventType',
    title: 'Event',
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
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
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
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) =>
      data.toAddress ? (
        <Address address={data.toAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'amounts',
    title: 'Amounts',
    type: 'number',
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
    modifier: 'address',
    render: (data) => {
      if (!data.toAddress) {
        return null
      }

      const values = AddressValues.token

      return (
        <div className={styles.data}>
          {data.tokenAddresses?.map((addr, idx) => {
            const logo = data.tokenLogos[idx] ? (
              <Image
                src={data.tokenLogos[idx]}
                width={24}
                height={24}
                alt={data.tokenSymbols[idx]}
                className={styles.icon}
              />
            ) : (
              <IconQuestion className={styles.icon} />
            )

            return (
              <div className={styles.dataRow} key={idx}>
                <Link
                  href={values.url(addr) || ''}
                  className={styles.dataValue}
                >
                  {logo}
                  <span className={styles.tokenSymbol}>
                    {data.tokenSymbols[idx]}
                  </span>
                  &nbsp;(
                  <span
                    className={styles.tokenName}
                    data-tooltip-content={data.tokenNames[idx]}
                    data-tooltip-id="app-tooltip"
                  >
                    {data.tokenNames[idx]}
                  </span>
                  )
                </Link>
              </div>
            )
          })}
        </div>
      )
    },
  },
]
