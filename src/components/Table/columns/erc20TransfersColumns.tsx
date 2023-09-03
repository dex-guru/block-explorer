import { Erc20EventModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from '@/components/Tables/Erc20DataTable/Erc20DataTable.module.scss'

export const erc20TransfersColumns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'fromAddress',
    title: 'Address Out',
    tooltip: 'The address where the token(s) were sent from.',
    modifier: 'address',
    render: (data) => (
      <ul className={styles.data}>
        <li className={styles.dataRow}>
          <Address address={data.fromAddress} type="account" isCopy />
        </li>
      </ul>
    ),
  },
  {
    accessor: 'toAddress',
    title: 'Address In',
    tooltip: 'The address that received the token(s).',
    modifier: 'address',
    render: (data) => (
      <ul className={styles.data}>
        <li className={styles.dataRow}>
          <Address address={`${data.toAddress}`} type="account" isCopy />
        </li>
      </ul>
    ),
  },
  {
    accessor: 'amounts',
    title: 'Quantity',
    type: 'number',
    modifier: 'tokenAmount',
    render: (data) => (
      <ul className={styles.data}>
        {data.amounts.map((amount, idx) => {
          return (
            <li className={styles.dataRow} key={idx}>
              <div className={styles.dataNumber}>
                {financialFormatLowValueHighPrecision(data.amounts[idx], {
                  highPrecession: true,
                })}
              </div>
            </li>
          )
        })}
      </ul>
    ),
  },
  {
    accessor: 'tokenSymbols',
    title: 'Token',
    type: 'text',
    modifier: 'tokenSymbol',
    render: (data) => (
      <ul className={styles.data}>
        {data.tokenAddresses?.map((addr, idx) => {
          return (
            <li className={styles.dataRow} key={idx}>
              <Token
                address={data.tokenAddresses[idx]}
                name={data.tokenNames[idx]}
                logo={data.tokenLogos[idx]}
                symbol={data.tokenSymbols[idx]}
              />
            </li>
          )
        })}
      </ul>
    ),
  },
]
