import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, IconNoIcon, Label, TimeAgo } from '@/components'
import { AddressValues } from '@/components/Address/helpers'
import { IColumn } from '@/components/Table/types'
import TooltipAnchor from '@/components/TooltipAnchor'
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
    render: (data) => <TimeAgo timestamp={data.blockTimestamp} />,
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
        <Address address={data.fromAddress} type="account" isCopy />
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
        <Address address={data.toAddress} type="account" isCopy />
      ) : null,
  },
  {
    accessor: 'amounts',
    title: 'Quantity',
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
              <IconNoIcon className={styles.icon} />
            )

            return (
              <div className={styles.dataRow} key={idx}>
                <Link
                  href={values.url(addr) || ''}
                  className={styles.dataValue}
                >
                  {logo}

                  <span className={styles.token}>
                    <span className={styles.tokenSymbol}>
                      <span className={styles.tokenSymbolCaption}>
                        {data.tokenSymbols[idx]}
                      </span>
                    </span>

                    <span
                      className={styles.tokenName}
                      data-tooltip-content={data.tokenNames[idx]}
                      data-tooltip-id="app-tooltip"
                    >
                      (
                      <span className={styles.tokenNameCaption}>
                        {data.tokenNames[idx]}
                      </span>
                      )
                    </span>
                  </span>
                </Link>
              </div>
            )
          })}
        </div>
      )
    },
  },
]
