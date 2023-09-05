import BigNumber from 'bignumber.js'
import { clsx } from 'clsx'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import { getNormalizedValue } from '@/lib/utils'
import styles from '@/components/TabContent/TxBalanceChanges.module.scss'

export const balanceChangesColumns: (chainConfig: ChainConfigModel) => IColumn<{
  address: string
  tokens: Array<string | null>
  tokenIds?: Array<string | null>
  balances: BigNumber[]
}>[] = (chainConfig) => [
  {
    accessor: 'address',
    title: 'Address',
    render: (row) => <Address address={row.address} type="account" isCopy />,
  },
  {
    accessor: 'tokens',
    title: 'Token',
    render: (row) => (
      <ul className={styles.data}>
        {row.tokens?.map((token, idx) => (
          <li className={styles.dataRow} key={idx}>
            {token === null ? (
              chainConfig.nativeCurrency.name
            ) : (
              <Address address={token || ''} type="token" isCopy />
            )}
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
            {balance.isPositive() ? '+' : ''}
            {getNormalizedValue(balance, 18, {
              highPrecession: true,
            }) || ''}
          </li>
        ))}
      </ul>
    ),
  },
]
