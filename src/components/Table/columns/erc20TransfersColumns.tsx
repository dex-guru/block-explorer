import Link from 'next/link'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address } from '@/components'
import { AddressValues } from '@/components/Address/helpers'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'
import styles from '@/app/Pages.module.scss'

export const erc20TransfersColumns: IColumn<Erc20EventModel>[] = [
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
          const tokenValues = AddressValues['token']
          const href = tokenValues?.url
            ? tokenValues?.url(data.tokenAddresses[idx])
            : ''
          return (
            <li key={idx} className={styles.tokenValue}>
              <Link href={href}>{data.tokenSymbols[idx]}</Link>
            </li>
          )
        })}
      </ul>
    ),
  },
]
