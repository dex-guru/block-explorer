import Image from 'next/image'

import clsx from 'clsx'

import { DexModel, Erc20EventModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Label from '@/components/Label'
import stylesTable from '@/components/Table/Table.module.scss'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import { financialFormat } from '@/lib/utils'
import styles from '@/pages/Pages.module.scss'

export const erc20ActionColumns = (dexes: DexModel[]): IColumn<Erc20EventModel>[] => [
  {
    accessor: 'dex',
    title: 'DEX',
    type: 'center',
    render: (data) => {
      const dex = dexes?.find((dex) => data.dex === dex.name)

      if (!dex?.logoURI) {
        return null
      }

      return (
        <Image
          src={dex?.logoURI || ''}
          alt={dex?.displayName || ''}
          width={24}
          height={24}
          className={styles.dex}
          data-tooltip-content={dex?.displayName}
          data-tooltip-id="app-tooltip"
        />
      )
    },
  },
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) => <Address address={data.fromAddress} type="account" isCopy />,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) => <Address address={`${data.toAddress}`} type="account" isCopy />,
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
    modifier: 'tokenAmount',
    render: (data) => (
      <ul className={stylesTable.data}>
        {data.amounts.map((amount, idx) => {
          return (
            <li className={stylesTable.dataRow} key={idx}>
              <div className={stylesTable.dataNumber}>{financialFormat(amount)}</div>
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
      <ul className={stylesTable.data}>
        {data.amounts.map((amount, idx) => {
          return (
            <li className={stylesTable.dataRow} key={idx}>
              <Token
                address={data.tokenAddresses[idx]}
                logo={data.tokenLogos[idx]}
                symbol={data.tokenSymbols[idx]}
                name={data.tokenNames[idx]}
              />
            </li>
          )
        })}
      </ul>
    ),
  },
]
