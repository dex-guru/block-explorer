import Link from 'next/link'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address } from '@/components'
import { AddressValues } from '@/components/Address/helpers'
import { IColumn } from '@/components/Table/types'
import TooltipAnchor from '@/components/TooltipAnchor'
import { financialFormat } from '@/lib/utils'
import styles from '@/pages/Pages.module.scss'

export const erc20TransfersColumns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'fromAddress',
    title: (
      <>
        Out{' '}
        <TooltipAnchor tooltip="Sent tokens and the address it was sent from" />
      </>
    ),
    modifier: 'address',
    render: (data) => (
      <Address address={data.fromAddress} type="account" isCopy />
    ),
  },
  {
    accessor: 'toAddress',
    title: (
      <>
        In{' '}
        <TooltipAnchor tooltip="Received tokens and the address that received them" />
      </>
    ),
    modifier: 'address',
    render: (data) => (
      <Address address={`${data.toAddress}`} type="account" isCopy />
    ),
  },
  {
    accessor: 'amounts',
    title: 'Token',
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
