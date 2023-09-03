import BigNumber from 'bignumber.js'
import { clsx } from 'clsx'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'
import styles from '@/components/TabContent/TxBalanceChanges.module.scss'

export const balanceChangesColumns: IColumn<{
  address: string
  tokens: string[]
  tokenIds?: string[]
  balances: BigNumber[]
}>[] = [
  {
    accessor: 'address',
    title: 'Address',
    render: (row) => <Address address={row.address} type="account" isCopy />,
  },
  {
    accessor: 'tokens',
    title: 'Token',
    tooltip: '?',
    render: (row) => (
      <ul className={styles.data}>
        {row.tokens?.map((token, idx) => (
          <li className={styles.dataRow} key={idx}>
            <Address address={token} type="token" isCopy />
          </li>
        ))}
      </ul>
    ),
  },
  {
    accessor: 'tokenIds',
    title: 'Token ID',
    render: (row) => (
      <ul className={styles.data}>
        {row.tokenIds?.map((id, idx) => (
          <li className={styles.dataRow} key={idx}>
            {id || ''}
          </li>
        ))}
      </ul>
    ),
  },
  {
    accessor: 'balances',
    title: 'Balance',
    render: (row) => (
      <ul className={styles.data}>
        {row.balances?.map((balance, idx) => (
          <li
            className={clsx(
              styles.dataRow,
              { [styles.negative]: balance.isNegative() },
              { [styles.positive]: balance.isPositive() }
            )}
            key={idx}
          >
            {getNormalizedValue(balance, 18, {
              highPrecession: true,
            }) || ''}
          </li>
        ))}
      </ul>
    ),
  },
]
