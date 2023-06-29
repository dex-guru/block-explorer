import Link from 'next/link'
import clsx from 'clsx'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, Label } from '@/components'
import { AddressValues } from '@/components/Address/helpers'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'
import styles from '@/pages/Pages.module.scss'

export const erc20ActionColumns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) => (
      <Address address={data.fromAddress} type="account" isCopy />
    ),
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) => (
      <Address address={`${data.toAddress}`} type="account" isCopy />
    ),
  },
  {
    accessor: 'eventType',
    title: 'Method',
    render: (data) => (
      <Label className={clsx(styles.label, styles[`label-${data.eventType}`])}>
        {data.eventType}
      </Label>
    ),
  },
  {
    accessor: 'amounts',
    title: 'For',
    type: 'number',
    modifier: 'tokenValue',
    render: (data) => (
      <ul className={styles.tokenValues}>
        {data.amounts.map((amount, idx) => {
          return (
            <li key={idx} className={styles.tokenValue}>
              {financialFormat(amount)}
            </li>
          )
        })}
      </ul>
    ),
  },
  {
    accessor: 'tokenSymbols',
    type: 'text',
    modifier: 'tokenSymbol',
    render: (data) => (
      <ul className={styles.tokenValues}>
        {data.amounts.map((amount, idx) => {
          return (
            <li key={idx} className={styles.tokenValue}>
              <Link
                href={
                  AddressValues['token'].url(data.tokenAddresses[idx]) || ''
                }
              >
                {data.tokenSymbols[idx]}
              </Link>
            </li>
          )
        })}
      </ul>
    ),
  },
]
