import clsx from 'clsx'
import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address, Label } from '@/components'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import { financialFormat } from '@/lib/utils'
import stylesTabel from '@/components/Table/Table.module.scss'
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
    modifier: 'tokenAmount',
    render: (data) => (
      <div className={stylesTabel.data}>
        {data.amounts.map((amount, idx) => {
          return (
            <div className={stylesTabel.dataRow} key={idx}>
              <div className={stylesTabel.dataNumber}>
                {financialFormat(amount)}
              </div>
            </div>
          )
        })}
      </div>
    ),
  },
  {
    accessor: 'tokenSymbols',
    type: 'text',
    modifier: 'tokenSymbol',
    render: (data) => (
      <div className={stylesTabel.data}>
        {data.amounts.map((amount, idx) => {
          return (
            <div className={stylesTabel.dataRow} key={idx}>
              <Token
                address={data.tokenAddresses[idx]}
                logo={data.tokenLogos[idx]}
                symbol={data.tokenSymbols[idx]}
                name={data.tokenNames[idx]}
              />
            </div>
          )
        })}
      </div>
    ),
  },
]
