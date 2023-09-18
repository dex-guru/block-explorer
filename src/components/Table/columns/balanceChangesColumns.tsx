import BigNumber from 'bignumber.js'
import { clsx } from 'clsx'
import {
  ChainConfigModel,
  Maybe,
  TokenModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { AddressValues } from '@/components/Address/helpers'
import Label from '@/components/Label'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import { getNormalizedValue } from '@/lib/utils'
import styles from '@/components/TabContent/TxBalanceChanges.module.scss'

export const balanceChangesColumns: (
  chainConfig: ChainConfigModel,
  tokens?: TokenModel[],
  fromAddress?: Maybe<string>,
  toAddress?: Maybe<string>
) => IColumn<{
  address: string
  tokens?: Array<string | null>
  tokenIds?: Array<string | null>
  balances: BigNumber[]
}>[] = (chainConfig, tokens, fromAddress, toAddress) => [
  {
    accessor: 'address',
    title: 'Address',
    render: (row) => {
      const tokenData = tokens?.find((tkn) => tkn.address === row.address)

      return (
        <>
          <Address
            address={row.address}
            type="account"
            isCopy
            showIcon
            logo={tokenData?.logoURI}
            title={tokenData?.name}
            className={styles.address}
          />
          {row.address === fromAddress && <Label title="Sender" />}
          {row.address === toAddress && <Label title="Receiver" />}
        </>
      )
    },
  },
  {
    accessor: 'balances',
    type: 'number',
    title: 'Balance',
    render: (row) => (
      <ul className={styles.data}>
        {row.balances?.map((balance, idx) => {
          const tokenData = tokens?.find((tkn) => tkn.address === row.address)

          return (
            <li
              className={clsx(
                styles.dataRow,
                { [styles.negative]: balance.isNegative() },
                { [styles.positive]: balance.isPositive() }
              )}
              key={idx}
            >
              <div className={styles.dataNumber}>
                {balance.isPositive() ? '+' : ''}
                {getNormalizedValue(balance, tokenData?.decimals, {
                  highPrecession: true,
                }) || ''}
              </div>
            </li>
          )
        })}
      </ul>
    ),
  },
  {
    accessor: 'tokens',
    title: 'Token',
    render: (row) => (
      <ul className={styles.data}>
        {row.tokens?.map((token, idx) => {
          const tokenData = tokens?.find((tkn) => tkn.address === token)

          return (
            <li className={styles.dataRow} key={idx}>
              <Token
                address={token}
                name={tokenData?.name}
                symbol={
                  token === null
                    ? chainConfig.nativeCurrency.name
                    : tokenData?.symbol || AddressValues.token.format(token)
                }
                logo={token === null ? chainConfig.icon : tokenData?.logoURI}
              />
            </li>
          )
        })}
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
]
